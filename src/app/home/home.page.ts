import { FilterPage } from "./../filter/filter.page";
import { ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { IonContent, ModalController } from "@ionic/angular";
// import { AnyARecord } from "dns";
import { RestService } from "../rest.service";
import { SelectVenuePopupPage } from "../select-venue-popup/select-venue-popup.page";
import { Geolocation } from "@capacitor/geolocation";
import { Observable, find } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { MapGeocoder, MapGeocoderResponse } from "@angular/google-maps";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { addDays, eachHourOfInterval, eachMinuteOfInterval, format, getDay, isAfter, isBefore, isEqual, isSameDay, parse, parseISO, set } from "date-fns";
declare var google: any;
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  @ViewChild("IonContent", { static: true })
  content!: IonContent;
  segmentModel = "venu";
  showfilter = false;
  venuarr: any = [];
  reservationsArr: any = [];
  filteredReservationsArr:any = [];
  venusNearUserLoc: any = [];
  venuarrOrg: any = "";
  number = "123";
  eventarr: any = [];
  filtertype: any = "no";
  reservationFilter: any = "no";
  filterTypeEv: any = "no";
  reservationFeature:any = '';
  // venusArray:any = []
  venues!: Observable<any>
  noevent = 0;
  noevenu = 0;
  noReservations = 0;

  pageNumber = 1;
  latitude: any;
  longitude: any;
  venueList: any;
  selectedVenue = {};
  selectedVenueName = "";

  filteredvenuarr: any = "";
  eventsArrayCopy: any;
  venuesFromGoogle:any = [];
  radius: any;
  placeType: any;
  claimedVenues: any = [];
  yourVoiceInput = '';
  listener: boolean = false;
  ai = "";
  aiToggleChecked: boolean = false;
  currentLat:any;
  currentLong:any;
  intervalId:any;
  venueKeywords:any = [];
  eventKeywords:any = [];
  dayTimeKeywords:string[] = ['until','till','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00', '1','2','3','4','5','6','7','8','9','10','11','12', 'a.m.', 'p.m.', 'tonight'];
  constructor(
    public router: Router,
    public rest: RestService,
    public modalCtrlr: ModalController,
    private http:HttpClient,
    private geoCoder: MapGeocoder,
    private changeDetectorRef: ChangeDetectorRef,
    private platform:Platform
  ) {
    if(!this.platform.is("mobileweb")){
      console.log('Requesting permissions');
      
      this.requestPermissions();
      
    }
    // this.testFunction();
    
  }

//  testTokens = ['show', 'me', 'all', 'non', 'indoor', 'events'];
//  evKeywords = [];


// testFunction(){
//   console.log(this.testTokens);
//  let resultingOutput  = this.findWordForEvents(this.testTokens);
//   console.log('resultingOutput:',resultingOutput);
// }




// findWordForEvents(inputTokens: string[]) {
//   
// }

// isSequenceMatch(keyword: string[], sequence: string[]) {
//     
// }

  getVenueAIKeywords(){
    let data = {
      "customer_id":this.userID
    }
    this.rest.sendRequest('venues_keywords',data).subscribe((res:any)=>{
      // console.log("venue_keywords are", res);
      if(res.status == 'success'){
        let venueKeywordsObj:any = {};
        venueKeywordsObj.budget = res.data[0].Budget;
        venueKeywordsObj.cuisine = res.data[0].Cuisine;
        venueKeywordsObj.food = res.data[0].Food;
        venueKeywordsObj.music = res.data[0].Music;
        venueKeywordsObj.types = res.data[0].Types;
        venueKeywordsObj.payments = ['cash','card'];
        venueKeywordsObj.checks = ['near me','in my area', 'quite', 'quiet', 'busy', 'very busy'];
        // 9:00 p.m. 12:00 p.m.
        // venueKeywordsObj.state = ['quite','quiet','busy','very busy'];

        for(let i=0; i<venueKeywordsObj.budget.length; i++){
         venueKeywordsObj.budget[i] = venueKeywordsObj.budget[i].budget_range;
        //  venueKeywordsObj.budget[i] = venueKeywordsObj.budget[i].split(/\s+/)[0];
        }
        for(let i=0; i<venueKeywordsObj.cuisine.length; i++){
          venueKeywordsObj.cuisine[i] = venueKeywordsObj.cuisine[i].cusine;
        }
        for(let i=0; i<venueKeywordsObj.types.length; i++){
          venueKeywordsObj.types[i] = venueKeywordsObj.types[i].venues_type_name;
        }
        for(let i=0; i<venueKeywordsObj.music.length; i++){
          venueKeywordsObj.music[i] = venueKeywordsObj.music[i].music_type;
          // venueKeywordsObj.music[i] = venueKeywordsObj.music[i].split(/\s+/)[0];
        }

        for(let i=0; i<venueKeywordsObj.food.length; i++){
          venueKeywordsObj.food[i] = venueKeywordsObj.food[i].food_type;
        }
        // console.log(venueKeywordsObj);
        this.venueKeywords = [...venueKeywordsObj.budget, ...venueKeywordsObj.cuisine, ...venueKeywordsObj.types, ...venueKeywordsObj.music, ...venueKeywordsObj.food, ...venueKeywordsObj.payments, ...venueKeywordsObj.checks , ...this.dayTimeKeywords];
      
        console.log('Venue Keywords:', this.venueKeywords);
        // this.findWords();
      }      
    });
  }
  getEventAIKeywords(){
    let data = {
      "customer_id":this.userID
    }
    this.rest.sendRequest('event_keywords',data).subscribe((res:any)=>{
      console.log("Event_keywords are", res);
      if(res.status == 'success'){
        let eventKeywordsObj:any = {};
       
        eventKeywordsObj.music = res.data[0].Event_Music;
        eventKeywordsObj.types = res.data[0].Event_Exp;
        eventKeywordsObj.negations = ['non','do not include'];
        eventKeywordsObj.checks = ['near me','around me','in my area'];
        // 9:00 p.m. 12:00 p.m.
       

      
        for(let i=0; i<eventKeywordsObj.types.length; i++){
          eventKeywordsObj.types[i] = eventKeywordsObj.types[i].event_type;
        }
        for(let i=0; i<eventKeywordsObj.music.length; i++){
          eventKeywordsObj.music[i] = eventKeywordsObj.music[i].event_music;
          // venueKeywordsObj.music[i] = venueKeywordsObj.music[i].split(/\s+/)[0];
        }

      
        // console.log(eventKeywordsObj);
        this.eventKeywords = [...eventKeywordsObj.negations , ...eventKeywordsObj.types, ...eventKeywordsObj.music, ...eventKeywordsObj.checks, ...this.dayTimeKeywords];
      
        console.log('Event Keywords:', this.eventKeywords);

      }      
    });
  }

  // ionViewWillLeave() {
  //   clearInterval(this.intervalId);
  // }

  alwaysSendCurrentLocation() {
    this.intervalId = setInterval(()=>{
      this.alwaysGetCurrentPosition();
    }, 120000);
  }

  async alwaysGetCurrentPosition() {
    const getCurrentLocation = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    console.log("Current Location: ", getCurrentLocation);
    this.currentLat = getCurrentLocation.coords.latitude;
    this.currentLong = getCurrentLocation.coords.longitude;
    console.log("getCurrentPositionCalled");
    
    console.log("currentLat: ", this.currentLat);
    console.log("currentLong: ", this.currentLong);

    let data = {
      customer_id:this.userID,  
      current_longitude:this.currentLong,
      current_latitude:this.currentLat
    }
    this.rest.sendRequest('updateLocation',data).subscribe((res:any)=>{
      console.log('send current location res: ',res);
    });
    
  
  }
  
  ngOnInit() {
    this.segmentModel = 'venu';
    
  }

  getClaimedVenues(){
    let data = {
      "users_customers_id":this.userID
    };
    this.rest.sendRequest('get_claimed_venues',data ).subscribe((res: any)=>{
    console.log("get_claimed_venues",res);
    if(res.status == 'success'){
      this.claimedVenues = res.data;
    }
      
    });
  }

  requestPermissions(){
    SpeechRecognition.requestPermissions().then((PermissionStatus)=>{
      console.log(PermissionStatus);
    });
   
  }

  async startSpeechRecognition(){
    
    if(this.listener){
      // console.log(this.listener);
      
      this.listener = false;
      SpeechRecognition.stop();
    }

    if(this.segmentModel == "venu"){
      this.venuarr = this.venuarrOrg;
      this.filtertype = "no"; 
      this.noevenu = 0;
    }
    else if(this.segmentModel == "reservation"  && this.reservationFeature == 'On'){
      this.filteredReservationsArr = this.reservationsArr;
      this.reservationFilter = "no";
      this.noReservations = 0;
    }
    else if(this.segmentModel == 'event'){
      this.eventarr = this.eventsArrayCopy;
      this.filterTypeEv = "no";
      this.noevent = 0;
    }else{

    }

    this.yourVoiceInput = '';
    // console.log('startSpeechRecognition');
    
    const {available} = await SpeechRecognition.available();
    // console.log('availability res: ',available);

    if(available){
      this.listener = true;

      SpeechRecognition.start({
        language: "en-US",
        popup: false,
        partialResults:true,
      });

      SpeechRecognition.addListener("partialResults", async (data: any) => {
        // console.log("partialResults was fired", data.matches);
        if(data.matches && data.matches.length > 0){  
          this.yourVoiceInput = data.matches[0];
          this.changeDetectorRef.detectChanges();
          
        }
      }).then((res: any) => {});
    }
  }

  async stopSpeechRecognition(){
    // console.log('stopSpeechRecognition');
    
    if(this.listener){
      // console.log(this.listener);
      
      this.listener = false;
      SpeechRecognition.stop();
    }
    // this.yourVoiceInput = 'Pizza shopp having 30% off';
    if(this.yourVoiceInput !='' ){
      // setTimeout(() => {
        this.dismissModal();  
      // }, 1500);
      
      this.findResults();
    }
  }

  findResults(){
    this.yourVoiceInput = this.yourVoiceInput.toLowerCase();
    let tokens = this.yourVoiceInput.split(/\s+/);
    console.log(tokens);
    if(this.segmentModel == "venu"){
      this.findVenueAndDiscount(tokens);
    }
    else if(this.segmentModel == "reservation"  && this.reservationFeature == 'On'){
     this.findReservationAndDiscount(tokens);
    }
    else if(this.segmentModel == 'event'){
      this.findEventAndDiscount(tokens);
    }else{

    }
    
  }
  
  findVenueAndDiscount = (inputTokens:string[]) => {
    this.noevenu = 0;
    let filteredVenues:any[] = [];
    
    let findNearMe = false;
    let findAroundMe = false;
    let findInMyArea = false;
    let findbusyStatus = false;
    let findDayTime = false;
    let busyStatus = '';

    let foundNearMe = false;
    let foundAroundMe = false;
    let foundInMyArea = false;
    let foundbusyStatus = false;
    let foundDayTime = false;

    let foundVenueName = false;
    let foundDiscount = false; 
    let foundNamedLocation = false;
    let foundSpecifiedChecks = false; 
    
    let venueName:string = '';
    let venueNameTokens: string[] = [];
    let venueLocationName:string = '';
    let venueLocationNameTokens: string[] = [];
    let venueDiscount = '';
    let dayTimeTokens: string[] = [];
    let venueEndTime:string;


    let foundWords = this.findWords(inputTokens);
    console.log("foundWords for loop: ",foundWords);
    
    
    if(foundWords.length > 0){
      findNearMe = foundWords.includes('near me');
      findAroundMe = foundWords.includes('around me');
      findInMyArea = foundWords.includes('in my area');
      dayTimeTokens = this.findCommonDayTimeTokens(foundWords);
      console.log('dayTimeTokens: ',dayTimeTokens);
      console.log('findNearMe: ',findNearMe);
      console.log('findInMyArea: ',findInMyArea);

      if(dayTimeTokens.length >=3 && (dayTimeTokens.includes('till') || dayTimeTokens.includes('until')) && 
      (dayTimeTokens.includes('a.m.') || dayTimeTokens.includes('p.m.')) ){
        findDayTime = true;
      }


      if(foundWords.includes('busy') ){
        busyStatus = 'busy';
        findbusyStatus = true;
      }else if(foundWords.includes('very busy')){
        busyStatus = 'very busy';
        findbusyStatus = true;
      }else if(foundWords.includes('quite') || foundWords.includes('quiet')){
        busyStatus = 'quiet';
        findbusyStatus = true;
      }else{}
    }

    

    for (let venueIndex = 0; venueIndex < this.venuarr.length; venueIndex++) {
      foundDiscount = false;
      foundVenueName = false;
      foundSpecifiedChecks = false;
      foundNamedLocation = false;
      foundbusyStatus = false;
      foundNearMe = false;
      foundInMyArea = false;
      foundAroundMe = false;
      foundDayTime = false;

      // ================= fetching data from venue data from next line =====================

     
      if(foundWords.length == 0){
        
        if(this.venuarr[venueIndex].discount_percentage != null){
          venueDiscount = this.venuarr[venueIndex].discount_percentage.toString() + '%';
        }else{
          venueDiscount = '';
        }
        // console.log("venuDiscount: ",venuDiscount);
        
        venueName = this.venuarr[venueIndex].name.toLowerCase();
        venueNameTokens = venueName.split(/\s+/);
        
        // console.log(venuNameTokens);

        venueLocationName = this.venuarr[venueIndex].location.toLowerCase();
        venueLocationNameTokens = venueLocationName.split(/\s+/);
        // console.log(venueLocationNameTokens);
      }else if(foundWords.length > 0){
        
        venueLocationName = this.venuarr[venueIndex].location.toLowerCase();
        venueLocationNameTokens = venueLocationName.split(/\s+/);
        // console.log(venueLocationNameTokens);
        
      }else{}

      // =========== finding required results from next line ===========================
      
      if(foundWords.length == 0){
        foundVenueName = this.filterForAI(inputTokens, venueNameTokens);
        console.log('foundVenueName: ',foundVenueName);
      
        foundDiscount = this.filterForAI(inputTokens,venueDiscount.split(/\s+/));
        console.log('foundDiscount: ',foundDiscount);
        
        foundNamedLocation = this.filterForAI(inputTokens, venueLocationNameTokens);
        console.log('foundNamedLocation: ',foundNamedLocation);
    
      }else if(foundWords.length >0){

        foundNamedLocation = this.filterForAI(inputTokens, venueLocationNameTokens);
        console.log('foundNamedLocation: ',foundNamedLocation);

         // ---------------------looking for daytime match----------------------
        
         if(findDayTime){
          // foundDayTime will be true for all events have matched time
          console.log('tonight not found');
          
          let dayNumber = getDay(new Date());
          if(this.venuarr[venueIndex].venue_timing[dayNumber].close_hours != null){
            venueEndTime = this.venuarr[venueIndex].venue_timing[dayNumber].close_hours;
          }else{
            venueEndTime = '';
          }

          if(venueEndTime != ''){
            let requestedTime:string = '';
          
            if(dayTimeTokens[0] === 'until') { 
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            }else if(dayTimeTokens[0] === 'till') {
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            }
  
            if(this.isVenueClosingTimeMatch(venueEndTime,requestedTime, dayTimeTokens)){
              foundDayTime = true;
            }else{
              foundDayTime = false;
            }

          }else{
            foundDayTime = false;
            console.log('venueEndTime not found');
            
          }

          console.log('foundDayTime:',foundDayTime);
          
        }

        // -------------------------- till here --------------------------
    
      }else{}
       
      if(foundWords.length > 0){
        // if(this.venuarr[venueIndex].venue_keywords.length > 0 && foundWords.length > 0){
          let venueKeywords =  this.venuarr[venueIndex].venue_keywords
          foundSpecifiedChecks = this.filterVenuesForAIFeature(venueKeywords, foundWords);
          console.log("foundSpecifiedChecks: ",foundSpecifiedChecks);
        // } 
  
        if(findbusyStatus){
          if(this.venuarr[venueIndex].availability.toLowerCase() == busyStatus){
            foundbusyStatus = true;
            console.log('foundbusyStatus: ',foundbusyStatus);
            
          }
        }

        if(findNearMe){
          if(Number.parseFloat(this.venuarr[venueIndex].distance) <= 1.0){
            foundNearMe = true;
            console.log("foundNearMe: ",findNearMe);
          }
        }

        if(findAroundMe){
          if(Number.parseFloat(this.venuarr[venueIndex].distance) <= 1.0){
            foundAroundMe = true;
            console.log("findAroundMe: ",findAroundMe);
          }
        }
        // else
         if(findInMyArea){
          if(Number.parseFloat(this.venuarr[venueIndex].distance) <= 2.1){
            foundInMyArea = true;
            console.log("foundInMyArea: ",foundInMyArea);
          }
        }
        // else{}
      }  

        

      // ==================== time to count found results=====================

      if(foundWords.length > 0){

        if(findNearMe && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundNearMe && foundbusyStatus && foundDayTime){
            console.log('adding venue by 1');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }

        else if(findAroundMe && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundAroundMe && foundbusyStatus && foundDayTime){
            console.log('adding venue by 1');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }
  
        else if(findInMyArea && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundInMyArea && foundbusyStatus && foundDayTime){
            console.log('adding venue by 2');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }
        
        else if(foundNamedLocation && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundbusyStatus && foundDayTime){
            console.log('adding venue by 3');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }

        else if(findNearMe && findbusyStatus  && findDayTime ){
          if(foundNearMe && foundbusyStatus && foundDayTime){
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 4');

        }

        else if(findAroundMe && findbusyStatus  && findDayTime ){
          if(foundAroundMe && foundbusyStatus && foundDayTime){
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 4');

        }
  
        else if(findInMyArea && findbusyStatus  && findDayTime ){
          if(foundInMyArea && foundbusyStatus && foundDayTime){
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 5');

        }
        
        else if(foundNamedLocation && findbusyStatus && findDayTime ){
          if(foundbusyStatus && foundDayTime){
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 6');

        }

        else if(foundSpecifiedChecks && findDayTime){
          if(foundDayTime){
            console.log('adding venue by 4');
            filteredVenues.push(this.venuarr[venueIndex]);
          }else{
            console.log('No matching criteria found 4');
          }
        }

        else if(findNearMe  && foundSpecifiedChecks){
          if(foundNearMe){
            filteredVenues.push(this.venuarr[venueIndex]);
            console.log('adding venue by 7');
          }

        }

        else if(findAroundMe  && foundSpecifiedChecks){
          if(foundAroundMe){
            filteredVenues.push(this.venuarr[venueIndex]);
            console.log('adding venue by 7');
          }

        }
  
        else if(findInMyArea && foundSpecifiedChecks){
          if(foundInMyArea){
            filteredVenues.push(this.venuarr[venueIndex]);
            console.log('adding venue by 8');
          }
        }
  
        else if(foundNamedLocation  && foundSpecifiedChecks){
          filteredVenues.push(this.venuarr[venueIndex]);
          console.log('adding venue by 8');

        }
  
        else if(findbusyStatus && foundSpecifiedChecks){
          if(foundbusyStatus){
            filteredVenues.push(this.venuarr[venueIndex]);
            console.log('adding venue by 9');

          }
        }

         //================== handling single cases====================

        //  else if(!findNearMe && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredVenues.push(this.venuarr[venueIndex]);
        //   }
        //   console.log('adding venue by single case 1');

        // }
  
        // else if(!findInMyArea && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredVenues.push(this.venuarr[venueIndex]);
        //   }
        //   console.log('adding venue by single case 2');

        // }
        
        // else if(!foundNamedLocation && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredVenues.push(this.venuarr[venueIndex]);
        //   }
        //   console.log('adding venue by single case 3');

        // }

        // else if(findNearMe && !findbusyStatus){
        //   if(foundNearMe){
        //     filteredVenues.push(this.venuarr[venueIndex]);
        //   }
        //   console.log('adding venue by single case 4');

        // }
  
        // else if(findInMyArea && !findbusyStatus){
        //   if(foundInMyArea){
        //     filteredVenues.push(this.venuarr[venueIndex]);
        //   }
        //   console.log('adding venue by single case 5');

        // }

      
        // ============== single case done =================
        
        else if(foundSpecifiedChecks){
          filteredVenues.push(this.venuarr[venueIndex]);
          console.log('adding venue by 10');

        }
  
        else{
  
        }

      }else if(foundWords.length == 0){
        if(foundVenueName || foundDiscount || foundNamedLocation){
          console.log("foundVenueName: ",foundVenueName);
          console.log("foundDiscount: ",foundDiscount);
          console.log('foundNamedLocation: ', foundNamedLocation);
          console.log('adding venue by 11');
          
          filteredVenues.push(this.venuarr[venueIndex]);
        }
      }else{

      }
      
    }

    this.filtertype = 'yes';
    console.log("filteredVenues: ",filteredVenues); 
    this.venuarr = filteredVenues;

    if(filteredVenues.length == 0){
      this.noevenu = 1;
    }else{
      this.noevenu = 0;
    }
    
  };

  findReservationAndDiscount = (inputTokens:string[]) => {
    this.noReservations = 0;
    let filteredReservations = [];

    let findNearMe = false;
    let findAroundMe = false;
    let findInMyArea = false;
    let findbusyStatus = false;
    let findDayTime = false;
    let busyStatus = '';

    let foundNearMe = false;
    let foundAroundMe = false;
    let foundInMyArea = false;
    let foundbusyStatus = false;
    let foundDayTime = false;

    let foundReservationName = false;
    let foundDiscount = false;
    let foundNamedLocation = false;
    let foundSpecifiedChecks = false; 


    let reservationName:string = '';
    let reservationNameTokens: string[] = [];
    let reservationLocationName:string = '';
    let reservationLocationNameTokens: string[] = [];
    let reservationDiscount = '';
    let dayTimeTokens: string[] = [];
    let venueEndTime:string;

    let foundWords = this.findWords(inputTokens);
    console.log("foundWords for loop: ",foundWords);
    
    
    if(foundWords.length > 0){
      findNearMe = foundWords.includes('near me');
      findAroundMe = foundWords.includes('around me');
      findInMyArea = foundWords.includes('in my area');
      dayTimeTokens = this.findCommonDayTimeTokens(foundWords);
      console.log('dayTimeTokens: ',dayTimeTokens);
      console.log('findNearMe: ',findNearMe);
      console.log('findInMyArea: ',findInMyArea);

      if(dayTimeTokens.length >=3 && (dayTimeTokens.includes('till') || dayTimeTokens.includes('until')) && 
      (dayTimeTokens.includes('a.m.') || dayTimeTokens.includes('p.m.')) ){
        findDayTime = true;
      }


      if(foundWords.includes('busy') ){
        busyStatus = 'busy';
        findbusyStatus = true;
      }else if(foundWords.includes('very busy')){
        busyStatus = 'very busy';
        findbusyStatus = true;
      }else if(foundWords.includes('quite') || foundWords.includes('quiet')){
        busyStatus = 'quiet';
        findbusyStatus = true;
      }else{}
    }

    

    for (let reservationIndex = 0; reservationIndex < this.filteredReservationsArr.length; reservationIndex++) {
      foundDiscount = false;
      foundReservationName = false;
      foundSpecifiedChecks = false;
      foundNamedLocation = false;
      foundbusyStatus = false;
      foundNearMe = false;
      foundInMyArea = false;
      foundAroundMe = false;
      foundDayTime = false;

      // ================= fetching data from venue data from next line =====================

     
      if(foundWords.length == 0){
        
        if(this.filteredReservationsArr[reservationIndex].discount_percentage != null){
          reservationDiscount = this.filteredReservationsArr[reservationIndex].discount_percentage.toString() + '%';
        }
        else{
          reservationDiscount = '';
        }
        
        // console.log("ReservationDiscount: ",reservationDiscount);
        
        reservationName = this.filteredReservationsArr[reservationIndex].name.toLowerCase();
        reservationNameTokens = reservationName.split(/\s+/);
  
        // console.log(reservationNameTokens);

       

        reservationLocationName = this.filteredReservationsArr[reservationIndex].location.toLowerCase();
        reservationLocationNameTokens = reservationLocationName.split(/\s+/);
       
        // console.log(reservationLocationNameTokens);

      }else if(foundWords.length > 0){
        
        reservationLocationName = this.filteredReservationsArr[reservationIndex].location.toLowerCase();
        reservationLocationNameTokens = reservationLocationName.split(/\s+/);
       
        // console.log(reservationLocationNameTokens);
        
      }else{}

      // =========== finding required results from next line ===========================
      
      if(foundWords.length == 0){
        foundReservationName = this.filterForAI(inputTokens, reservationNameTokens);
        console.log('foundReservationName: ',foundReservationName);
      
        foundDiscount = this.filterForAI(inputTokens,reservationDiscount.split(/\s+/));
        console.log('foundDiscount: ',foundDiscount);
        
        foundNamedLocation = this.filterForAI(inputTokens, reservationLocationNameTokens);
        console.log('foundNamedLocation: ',foundNamedLocation);
    
      }else if(foundWords.length >0){

        foundNamedLocation = this.filterForAI(inputTokens, reservationLocationNameTokens);
        console.log('foundNamedLocation: ',foundNamedLocation);

         // ---------------------looking for daytime match----------------------
        
         if(findDayTime){
          // foundDayTime will be true for all events have matched time
          console.log('tonight not found');
          
          let dayNumber = getDay(new Date());
          if(this.filteredReservationsArr[reservationIndex].venue_timing[dayNumber].close_hours != null){
            venueEndTime = this.filteredReservationsArr[reservationIndex].venue_timing[dayNumber].close_hours;
          }else{
            venueEndTime = '';
          }

          if(venueEndTime != ''){
            let requestedTime:string = '';
          
            if(dayTimeTokens[0] === 'until') { 
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            }else if(dayTimeTokens[0] === 'till') {
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            }
  
            if(this.isVenueClosingTimeMatch(venueEndTime,requestedTime, dayTimeTokens)){
              foundDayTime = true;
            }else{
              foundDayTime = false;
            }

          }else{
            foundDayTime = false;
            console.log('venueEndTime not found');
            
          }

          console.log('foundDayTime:',foundDayTime);
          
        }

        // -------------------------- till here --------------------------
    
      }else{}
       
      if(foundWords.length > 0){
        // if(this.filteredReservationsArr[reservationIndex].venue_keywords.length > 0 && foundWords.length > 0){
          let venueKeywords =  this.filteredReservationsArr[reservationIndex].venue_keywords;
          foundSpecifiedChecks = this.filterVenuesForAIFeature(venueKeywords, foundWords);
          console.log("foundSpecifiedChecks: ",foundSpecifiedChecks);
        // } 
  
        if(findbusyStatus){
          if(this.filteredReservationsArr[reservationIndex].availability.toLowerCase() == busyStatus){
            foundbusyStatus = true;
            console.log('foundbusyStatus: ',foundbusyStatus);
            
          }
        }

        if(findNearMe){
          if(Number.parseFloat(this.filteredReservationsArr[reservationIndex].distance) <= 1.0){
            foundNearMe = true;
            console.log("foundNearMe: ",findNearMe);
          }
        }

        if(findAroundMe){
          if(Number.parseFloat(this.filteredReservationsArr[reservationIndex].distance) <= 1.0){
            foundAroundMe = true;
            console.log("findAroundMe: ",findAroundMe);
          }
        }
        // else
         if(findInMyArea){
          if(Number.parseFloat(this.filteredReservationsArr[reservationIndex].distance) <= 2.1){
            foundInMyArea = true;
            console.log("foundInMyArea: ",foundInMyArea);
          }
        }
        // else{}
      }  

        

      // ==================== time to count found results=====================

      if(foundWords.length > 0){

        if(findNearMe && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundNearMe && foundbusyStatus && foundDayTime){
            console.log('adding venue by 1');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }

        else if(findAroundMe && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundAroundMe && foundbusyStatus && foundDayTime){
            console.log('adding venue by 1');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }
  
        else if(findInMyArea && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundInMyArea && foundbusyStatus && foundDayTime){
            console.log('adding venue by 2');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }
        
        else if(foundNamedLocation && findbusyStatus && foundSpecifiedChecks && findDayTime ){
          if(foundbusyStatus && foundDayTime){
            console.log('adding venue by 3');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }

        else if(findNearMe && findbusyStatus  && findDayTime ){
          if(foundNearMe && foundbusyStatus && foundDayTime){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 4');

        }

        else if(findAroundMe && findbusyStatus  && findDayTime ){
          if(foundAroundMe && foundbusyStatus && foundDayTime){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 4');

        }
  
        else if(findInMyArea && findbusyStatus  && findDayTime ){
          if(foundInMyArea && foundbusyStatus && foundDayTime){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 5');

        }
        
        else if(foundNamedLocation && findbusyStatus && findDayTime ){
          if(foundbusyStatus && foundDayTime){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 6');

        }

        else if(foundSpecifiedChecks && findDayTime){
          if(foundDayTime){
            console.log('adding venue by 4');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }else{
            console.log('No matching criteria found 4');
          }
        }

        else if(findNearMe  && foundSpecifiedChecks){
          if(foundNearMe){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
            console.log('adding venue by 7');
          }

        }

        else if(findAroundMe  && foundSpecifiedChecks){
          if(foundAroundMe){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
            console.log('adding venue by 7');
          }

        }
  
        else if(findInMyArea && foundSpecifiedChecks){
          if(foundInMyArea){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
            console.log('adding venue by 8');
          }
        }
  
        else if(foundNamedLocation  && foundSpecifiedChecks){
          filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          console.log('adding venue by 8');

        }
  
        else if(findbusyStatus && foundSpecifiedChecks){
          if(foundbusyStatus){
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
            console.log('adding venue by 9');

          }
        }

         //================== handling single cases====================

        //  else if(!findNearMe && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
        //   }
        //   console.log('adding venue by single case 1');

        // }
  
        // else if(!findInMyArea && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
        //   }
        //   console.log('adding venue by single case 2');

        // }
        
        // else if(!foundNamedLocation && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
        //   }
        //   console.log('adding venue by single case 3');

        // }

        // else if(findNearMe && !findbusyStatus){
        //   if(foundNearMe){
        //     filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
        //   }
        //   console.log('adding venue by single case 4');

        // }
  
        // else if(findInMyArea && !findbusyStatus){
        //   if(foundInMyArea){
        //     filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
        //   }
        //   console.log('adding venue by single case 5');

        // }

      
        // ============== single case done =================
        
        else if(foundSpecifiedChecks){
          filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          console.log('adding venue by 10');

        }
  
        else{
  
        }

      }else if(foundWords.length == 0){
        if(foundReservationName || foundDiscount || foundNamedLocation){
          console.log("foundReservationNamee: ",foundReservationName);
          console.log("foundDiscount: ",foundDiscount);
          console.log('foundNamedLocation: ', foundNamedLocation);
          console.log('adding venue by 11');
          
          filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
        }

      }else{

      }
      
    }


    this.reservationFilter = 'yes';
    console.log("filteredReservationes: ",filteredReservations); 
    this.filteredReservationsArr = filteredReservations;

    if(filteredReservations.length == 0){
      this.noReservations = 1;
    }else{
      this.noReservations = 0;
    }
    
  };

  findEventAndDiscount = (inputTokens:string[]) => {
    this.noevent = 0;
    let filteredEvents = [];

    let findNearMe = false;
    let findAroundMe = false;
    let findInMyArea = false;
    let findDayTime = false;
   
    let foundNearMe = false;
    let foundAroundMe = false;
    let foundInMyArea = false;
    let foundDayTime = false;

    let foundEventName = false;
    let foundDiscount = false;
    let foundNamedLocation = false;
    let foundSpecifiedChecks = false; 
    
    
    let eventName:string = '';
    let eventNameTokens: string[] = [];
    let eventLocationName:string = '';
    let eventLocationNameTokens: string[] = [];
    let eventDiscount = '';
    let dayTimeTokens: string[] = [];
    let eventEndTime:string;
    let eventDateStr: string;

    let foundWords = this.findWordsforEvents(inputTokens);
    console.log("foundWords for loop: ",foundWords); 
    // let find
    
    if(foundWords.length > 0){
      findNearMe = foundWords.includes('near me');
      findAroundMe = foundWords.includes('around me');
      findInMyArea = foundWords.includes('in my area');
      dayTimeTokens = this.findCommonDayTimeTokens(foundWords);
      console.log('dayTimeTokens: ',dayTimeTokens);
      console.log('findNearMe: ',findNearMe);
      console.log('findInMyArea: ',findInMyArea);

      if(dayTimeTokens.length >=3 && (dayTimeTokens.includes('till') || dayTimeTokens.includes('until')) && 
      (dayTimeTokens.includes('a.m.') || dayTimeTokens.includes('p.m.')) ){
        findDayTime = true;
      }
    
    }

    for (let eventIndex = 0; eventIndex < this.eventarr.length; eventIndex++) {
      foundDiscount = false;
      foundEventName = false;
      foundSpecifiedChecks = false;
      foundNamedLocation = false;
      foundNearMe = false;
      foundAroundMe = false;
      foundInMyArea = false;
      foundDayTime = false;

      // ================= fetching data from venue data from next line =====================
      
     
      if(foundWords.length == 0){
        
        if(this.eventarr[eventIndex].discount_percentage != null){
          eventDiscount = this.eventarr[eventIndex].discount_percentage.toString() + '%';
        }else{
          eventDiscount = '';
        }
       
        // console.log("eventDiscount: ",eventDiscount);

        eventName = this.eventarr[eventIndex].name.toLowerCase();
        eventNameTokens = eventName.split(/\s+/);
  
        // console.log(eventNameTokens);

        eventLocationName = this.eventarr[eventIndex].location.toLowerCase();
        eventLocationNameTokens = eventLocationName.split(/\s+/);
        // console.log(eventLocationNameTokens);
      }else if(foundWords.length > 0){
        
        eventLocationName = this.eventarr[eventIndex].location.toLowerCase();
        eventLocationNameTokens = eventLocationName.split(/\s+/);
        // console.log(eventLocationNameTokens);


       
        // if(findDayTime){
        //   eventEndTime = this.eventarr[eventIndex].event_end_time;
        // }
        // if(findDayTime && dayTimeTokens.includes('tonight')){
        //   eventDateStr = this.eventarr[eventIndex].event_date;
        // }
        
      }else{}

      // =========== finding required results from next line ===========================
      
      if(foundWords.length == 0){
        foundEventName = this.filterForAI(inputTokens, eventNameTokens);
        console.log('foundEventName: ',foundEventName);
      
        foundDiscount = this.filterForAI(inputTokens,eventDiscount.split(/\s+/));
        console.log('foundDiscount: ',foundDiscount);
        
        foundNamedLocation = this.filterForAI(inputTokens, eventLocationNameTokens);
        console.log('foundNamedLocation: ',foundNamedLocation);
    
      }else if(foundWords.length >0){

        foundNamedLocation = this.filterForAI(inputTokens, eventLocationNameTokens);
        console.log('foundNamedLocation: ',foundNamedLocation);

        // ---------------------looking for daytime match----------------------
        
        if(findDayTime && !dayTimeTokens.includes('tonight')){
          // foundDayTime will be true for all events have matched time
          console.log('tonight not found');
          
          let requestedTime:string = '';
          eventEndTime = this.eventarr[eventIndex].event_end_time;
          
          if(dayTimeTokens[0] === 'until') { 
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          }else if(dayTimeTokens[0] === 'till') {
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          }

          if(this.isVenueClosingTimeMatch(eventEndTime,requestedTime, dayTimeTokens)){
            foundDayTime = true;
          }else{
            foundDayTime = false;
          }

          console.log('foundDayTime:',foundDayTime);
          
          
          // try {
          //   let requestedTimeDate = new Date();
          //   let eventEndTimeDate; 

          //   eventEndTime = this.eventarr[eventIndex].event_end_time;
          //   eventEndTimeDate = parse(eventEndTime, 'HH:mm:ss', new Date());

          //   if(dayTimeTokens[0] === 'until') { 
          //     requestedTimeDate = parse(`${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`, 'h:mm aaaa', new Date());
          //   }else if(dayTimeTokens[0] === 'till') {
          //     requestedTimeDate = parse(`${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`, 'h:mm aaaa', new Date());
          //   }

          //   console.log('requestedTimeDate: ',requestedTimeDate);
            
          //   console.log('eventEndTimeDate: ',eventEndTimeDate);

          //   // Adjust date2 to next day if it's earlier than date1
          //   // if (eventEndTimeDate < new Date()) {
          //   //   eventEndTimeDate.setDate(eventEndTimeDate.getDate() + 1);
          //   // }else if(requestedTimeDate < new Date()){
          //   //   requestedTimeDate.setDate(requestedTimeDate.getDate() + 1);
          //   // }else{

          //   // }

          //   // if(requestedTimeDate <= eventEndTimeDate){

          //   // }
            
          // } catch (error) {
          //   console.log(error);
            
          // }
        }

        if(findDayTime && dayTimeTokens.includes('tonight')){
          // foundDayTime will be true for only events have matched time and today date  
          console.log('tonight found');
          
          let todayDate = new Date();
          eventDateStr = this.eventarr[eventIndex].event_date;
          const eventDate = parseISO(eventDateStr);

          const formattedTodayDate = format(todayDate, 'yyyy-MM-dd');
          const formattedEventDate = format(eventDate, 'yyyy-MM-dd');

          console.log('formattedTodayDate: ',formattedTodayDate);
          console.log('formattedEventDate: ',formattedEventDate);

          let requestedTime:string = '';
          eventEndTime = this.eventarr[eventIndex].event_end_time;
          
          if(dayTimeTokens[0] === 'until') { 
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          }else if(dayTimeTokens[0] === 'till') {
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          }

          if(formattedTodayDate === formattedEventDate && this.isVenueClosingTimeMatch(eventEndTime,requestedTime, dayTimeTokens)){
            foundDayTime = true;
          }else{
            foundDayTime = false;
          }

          console.log('foundDayTime:',foundDayTime);
          
          
        }

        // -------------------------- till here --------------------------
    
      }else{}
       
      if(foundWords.length > 0){
        // if(this.eventarr[eventIndex].venue_keywords.length > 0 && foundWords.length > 0){
          let eventKeywords =  this.eventarr[eventIndex].event_keywords
          foundSpecifiedChecks = this.filterEventsForAIFeature(eventKeywords, foundWords); 
          console.log("foundSpecifiedChecks: ",foundSpecifiedChecks);
        // } 

        if(findNearMe){
          if(Number.parseFloat(this.eventarr[eventIndex].distance) <= 1.0){
            foundNearMe = true;
            console.log("foundNearMe: ",findNearMe);
          }
        }

        if(findAroundMe){
          if(Number.parseFloat(this.eventarr[eventIndex].distance) <= 1.0){
            foundAroundMe = true;
            console.log("findAroundMe: ",findAroundMe);
          }
        }
        // else
        if(findInMyArea){
          if(Number.parseFloat(this.eventarr[eventIndex].distance) <= 2.1){
            foundInMyArea = true;
            console.log("foundInMyArea: ",foundInMyArea);
          }
        }
        // else{}
      }  

        

      // ==================== time to count found results=====================

      if(foundWords.length > 0){

        if(findNearMe && foundSpecifiedChecks && findDayTime){
          if(foundNearMe && foundDayTime){
            console.log('adding venue by 1');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 1');
          }
        }

        else if(findAroundMe &&  foundSpecifiedChecks && findDayTime){
          if(foundAroundMe && foundDayTime){
            console.log('adding venue by 1.1');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 1.1');
          }
        }
  
        else if(findInMyArea  && foundSpecifiedChecks && findDayTime){
          if(foundInMyArea && foundDayTime){
            console.log('adding venue by 2');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 2');
          }
        }
        
        else if(foundNamedLocation &&  foundSpecifiedChecks && findDayTime){
          if(foundDayTime){
            console.log('adding venue by 3');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 3');
          }
        }

        else if(foundSpecifiedChecks && findDayTime){
          if(foundDayTime){
            console.log('adding venue by 4');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 4');
          }
        }

        else if(findNearMe &&  foundSpecifiedChecks  ){
          if(foundNearMe){
            console.log('adding venue by 5');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 5');
          }
        }

        else if(findAroundMe &&  foundSpecifiedChecks ){
          if(foundAroundMe){
            console.log('adding venue by 6');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 6');
          }
        }
  
        else if(findInMyArea  && foundSpecifiedChecks ){
          if(foundInMyArea){
            console.log('adding venue by 7');
            filteredEvents.push(this.eventarr[eventIndex]);
          }else{
            console.log('No matching criteria found 7');
          }
          
        }
        
        else if(foundNamedLocation &&  foundSpecifiedChecks ){
          console.log('adding venue by 3');
          filteredEvents.push(this.eventarr[eventIndex]);
        }

        else if( foundSpecifiedChecks){
          filteredEvents.push(this.eventarr[eventIndex]);
          console.log('adding venue by 9');
        }

        // else if(findNearMe ){
        //   if(foundNearMe ){
        //     filteredEvents.push(this.eventarr[eventIndex]);
        //   }
        //   console.log('adding venue by 4');

        // }
  
        // else if(findInMyArea){
        //   if(foundInMyArea ){
        //     filteredEvents.push(this.eventarr[eventIndex]);
        //   }
        //   console.log('adding venue by 5');

        // }
        
        // else if(foundNamedLocation){
        //   filteredEvents.push(this.eventarr[eventIndex]);
        //   console.log('adding venue by 6');
        // }
  
         //================== handling single cases====================

        //  else if(!findNearMe && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredEvents.push(this.eventarr[eventIndex]);
        //   }
        //   console.log('adding venue by single case 1');

        // }
  
        // else if(!findInMyArea && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredEvents.push(this.eventarr[eventIndex]);
        //   }
        //   console.log('adding venue by single case 2');

        // }
        
        // else if(!foundNamedLocation && findbusyStatus){
        //   if(foundbusyStatus){
        //     filteredEvents.push(this.eventarr[eventIndex]);
        //   }
        //   console.log('adding venue by single case 3');

        // }

        // else if(findNearMe && !findbusyStatus){
        //   if(foundNearMe){
        //     filteredEvents.push(this.eventarr[eventIndex]);
        //   }
        //   console.log('adding venue by single case 4');

        // }
  
        // else if(findInMyArea && !findbusyStatus){
        //   if(foundInMyArea){
        //     filteredEvents.push(this.eventarr[eventIndex]);
        //   }
        //   console.log('adding venue by single case 5');

        // }

      
        // ============== single case done =================
  
        else{
  
        }

      }else if(foundWords.length == 0){
        if(foundEventName || foundDiscount || foundNamedLocation){
          console.log("foundEventName: ",foundEventName);
          console.log("foundDiscount: ",foundDiscount);
          console.log('foundNamedLocation: ', foundNamedLocation);
          console.log('adding venue by 11');
          
          filteredEvents.push(this.eventarr[eventIndex]);
        }

      }else{

      }
      
    }

    this.filterTypeEv = 'yes';
    console.log("filteredEvents: ",filteredEvents); 
    this.eventarr = filteredEvents;

    if(filteredEvents.length == 0){
      this.noevent = 1;
    }else{
      this.noevent = 0;
    }
    
  };
  
  findWords(inputTokens:string[]) {
    let foundWords:string[] = [];
    // specialCaseTimeValue 1:00, 1:01, 1:02 ..... 11:58, 11:59, 12:00
    let specialTimeCase = false;
    let specialTimeValue = '';
    this.venueKeywords.forEach((keyword:string) => {
      const formattedVenuKeyword = keyword.toLowerCase().replace(/-/g,' ').split(/\s+/);
      // console.log("formattedVenuKeyword: ",formattedVenuKeyword);
      let result = formattedVenuKeyword.every((key:string)=>{
        let res = false;
        inputTokens.forEach((token:string)=>{
          
          if(token == 'rnb' && key == 'r&b'){
            res = true;
          }else if(token.includes(':') && key.includes(':')){
            console.log("token is", token);
           
            let splitToken = token.split(':');
            let splitKey = key.split(':');
    
            if(splitToken[0] === splitKey[0]){
              console.log('splitToken:',splitToken);
              console.log('splitKey: ', splitKey);
              specialTimeCase = true;
              specialTimeValue = token;
              res = true;
            }
           
          }
          else{
            if(token === key){
              res = true;
            }else if(this.stemWord(token) === key ){
              res = true;
            }
           
          }
          
        });
        return res;
      });
      // console.log(result);
      if(result){
        if(specialTimeCase){
          foundWords.push(specialTimeValue);
          specialTimeCase = false;
        }else{
          // console.log('Match found');
          foundWords.push(keyword);
        }
      } 
    });
    // console.log(foundWords);
    return foundWords;
    
  }

  findWordsforEvents(inputTokens:string[]) {
    let foundWords:string[] = [];
    // specialCaseTimeValue 1:00, 1:01, 1:02 ..... 11:58, 11:59, 12:00
    let specialTimeCase = false;
    let specialTimeValue = '';
    this.eventKeywords.forEach((keyword:string) => {
      const formattedEventKeyword = keyword.toLowerCase().replace(/-/g,' ').split(/\s+/);
      // console.log("formattedEventKeyword: ",formattedEventKeyword);
      let result = formattedEventKeyword.every((key:string)=>{
        let res = false;
        inputTokens.forEach((token:string)=>{
          
          if(token == 'rnb' && key == 'r&b'){
            res = true;
          }
          else if(token.includes(':') && key.includes(':')){
            console.log("token is", token);
           
            let splitToken = token.split(':');
            let splitKey = key.split(':');
    
            if(splitToken[0] === splitKey[0]){
              console.log('splitToken:',splitToken);
              console.log('splitKey: ', splitKey);
              specialTimeCase = true;
              specialTimeValue = token;
              res = true;
            }
           
          }
          else{
            if(token === key){
              res = true;
            }else if(this.stemWord(token) === key ){
              res = true;
            }
           
          }
          
        });
        return res;
      });
      
      // console.log(result);
      if(result){
        if(specialTimeCase){
          foundWords.push(specialTimeValue);
          specialTimeCase = false;
        }else{
          // console.log('Match found');
          foundWords.push(keyword);
        }
      } 
    });
    
    // console.log(foundWords);
    return foundWords;
    
  }

  stemWord(word:string){
    if(word.endsWith('s')){
      return word.slice(0,-1);
    }
    return word;
  }

  filterForAI(inputTokens:string[], targetTokens:string[]){
    return targetTokens.some((token:any)=>{
      if(token == '0%'){
        if(inputTokens.includes('0%') || inputTokens.includes('zero')){
          return true;
        }else{
          return false;
        }
      }else{
        return inputTokens.includes(token);
      }
      
    });
  }

  filterVenuesForAIFeature(keywords:any[], queryParams:string[]){
    let otherKeys = ['near me','in my area','until','till','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00', '1','2','3','4','5','6','7','8','9','10','11','12', 'a.m.', 'p.m.', 'quite', 'quiet', 'busy', 'very busy']
    return queryParams.every((param:string)=>{
      const paramKey = param.toLowerCase().replace(/-/g,' ').split(/\s+/);
      console.log('New param is: ',paramKey);
      
      let res = false;
     
     
        for(let i=0; i<keywords.length; i++){
          let keyword = keywords[i].keyword_value;
          const keys = keyword.toLowerCase().replace(/-/g,' ').split(/\s+/);
          res = paramKey.every((pk:any)=>{
            if(keys.includes(pk)){
              return true;
            }else if(!keys.includes(pk)){
              if(otherKeys.includes(param) || param.includes(':')){
                console.log('other keys');
                console.log(param);
                return true;
              }else{
                return false;
              }
              
            }else{
              return false;
            }
            
          });
          if(res){
            console.log('Match found: ', res);
            console.log('word is: ',paramKey);
            console.log('key is: ',keys);
            
            break;
          }
        }

        if(!res){
          console.log('Result for this parma is:', res);
          console.log('word is: ',paramKey);
        }
       
      return res;
    });
  }

  filterEventsForAIFeature(keywords:any[], queryParams:string[]){
    let otherKeys = ['non','do not include','near me','around me','in my area', 'until','till','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00', '1','2','3','4','5','6','7','8','9','10','11','12', 'a.m.', 'p.m.', 'tonight'];
    let negationKeyIndex: number | undefined = undefined;
    return queryParams.every((param:string)=>{
      const paramKey = param.toLowerCase().replace(/-/g,' ').split(/\s+/);
      console.log('New param is: ',paramKey);
      console.log('negationKeyIndex: ',negationKeyIndex);
      
      let res = false;
      
      for(let i=0; i<keywords.length; i++){
        let keyword = keywords[i].keyword_value;
        const keys = keyword.toLowerCase().replace(/-/g,' ').split(/\s+/);
        
        
        res = paramKey.every((pk:any,index)=>{
          if(keys.includes(pk) && negationKeyIndex === undefined){
            // console.log('case 1');
            console.log('keys: ',keys);
            console.log('paramKey: ',paramKey);
            return true;
          }
          else if(keys.includes(pk) && negationKeyIndex !== undefined){
            // if(index === paramKey.length-1){
              negationKeyIndex = undefined;
            // }
            // console.log('case 2');
            console.log('keys: ',keys);
            console.log('paramKey: ',paramKey);
            return false;
          }
          else if(!keys.includes(pk) && negationKeyIndex === undefined){
            // the following check param.includes(':') is to check if the param is a time range of special case.
            // specialCaseTimeValue 1:00, 1:01, 1:02 ..... 11:58, 11:59, 12:00 
            if(otherKeys.includes(param) || param.includes(':')){
            
              if(param === 'non' || param === 'do not include'){

                if(index === paramKey.length-1){
                  negationKeyIndex = queryParams.indexOf(param);

                }
                console.log('other keys(negation)');
                // console.log('case 4');
                
                console.log(param);
                return true;
                
              }else{
                // console.log('case 5');

                console.log('other keys');
                console.log(param);
                return true;
              }
           
            }else{
              // console.log('case 6');
              
              return false;
            }
          } 
          else{
            // console.log('case 7');
            return false;
          }
        });
        if(res){ 
          console.log('Match found: ', res);
          console.log('word is: ',paramKey);
          console.log('key is: ',keys);
          
          break;
        }
      }

      if(!res && negationKeyIndex !== undefined){
        res = true;
        negationKeyIndex = undefined;
      }else if(!res && negationKeyIndex === undefined){
        console.log('Result for this parma is:', res);
        console.log('word is: ',paramKey);
      }
       
      return res;
    });
  }

  

  isVenueClosingTimeMatch(eventEndTime:string, userRequestedTimeStr:string, dayTimeTokens:string[]) {

    try {
      let requestedTimeDate = new Date();
      let eventEndTimeDate; 

      // Parse the closing time string into a Date object
      eventEndTimeDate = parse(eventEndTime, 'HH:mm:ss', new Date());

      // Parse the user requested time string into a Date object
      requestedTimeDate = parse(userRequestedTimeStr, 'h:mm aaaa', new Date());

      console.log('requestedTimeDate: ',requestedTimeDate);
      
      console.log('eventEndTimeDate: ',eventEndTimeDate);

      if(isEqual(requestedTimeDate, eventEndTimeDate)){
        return true;
      }
      // If closing time is on or after user requested time on the same day, return true
      // if ((isSameDay(eventEndTimeDate, requestedTimeDate) && isAfter(eventEndTimeDate, requestedTimeDate)) || isEqual(eventEndTimeDate, requestedTimeDate)) {
      //   return true;
      // }

      // If closing time is after user requested time on the next day, return true
      // const nextDayEventEndTimeDate = addDays(eventEndTimeDate, -1); // Closing time at the end of the previous day
      // if(isAfter(eventEndTimeDate, requestedTimeDate) && isAfter(nextDayEventEndTimeDate, requestedTimeDate)) {
      //   return true;
      // }

      return false;
      
    } catch (error) {
      console.log(error);
      
      return false;
      
    }
    

    
  }

  
  findCommonDayTimeTokens(foundWords:string[]){
    let commonDayTimeTokens:string[] = [];
    
    for(let word of foundWords){
      console.log('word: ', word);
      for(let key of this.dayTimeKeywords){

       if(word.includes(':') && key.includes(':')){
        console.log("word is", word);
       
        let splitWord = word.split(':');
        let splitKey = key.split(':');

        if(splitWord[0] === splitKey[0]){
          console.log('splitToken:',splitWord);
          console.log('splitKey: ', splitKey);
          commonDayTimeTokens.push(word);
          break;
        }
       
        }else if(!word.includes(':') && !key.includes(':')){
          if(word === key){
            commonDayTimeTokens.push(word);
            break;
          }
        }

      }
      
    }
    return commonDayTimeTokens;
  }

  standardizeHour(hour:string){
    if(hour.includes(':')){
      return hour;
    }else{
      return `${hour}:00`;
    }
  }

  dismissModal(){
    console.log('stopSpeechRecognition');
    
    if(this.listener){
      console.log(this.listener);
      
      this.listener = false;
      SpeechRecognition.stop();
    }
    this.modalCtrlr.dismiss();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  // ======== code to get venues from google and adding them in venues api according to api's key value pairs ================
  // map!: google.maps.Map;
  // service!: google.maps.places.PlacesService;
  
  
  // initialize() {
  //   let lat = localStorage.getItem("lattitude");
  //   let lng = localStorage.getItem("longitude");

  //   var pyrmont = new google.maps.LatLng(lat,lng);

  //   this.map = new google.maps.Map(document.getElementById('map'), {
  //     center: pyrmont,
  //     // zoom: 15
  //   });

  //   if(this.pageNumber == 1){
  //     this.radius = 2500;
  //     this.placeType= 'restaurant';
  //   }else if(this.pageNumber == 2){
  //     this.radius = 2500;
  //     this.placeType= 'bar';

  //   }

  //   let request = {
  //     location: pyrmont,
  //     radius: this.radius, 
  //     type: this.placeType
  //   };

  //   this.service = new google.maps.places.PlacesService(this.map);
  //   this.service.textSearch(request, this.callback);
  // }

  // callback = (results:google.maps.places.PlaceResult[] | null, status:google.maps.places.PlacesServiceStatus) => {
  //   console.log("nearByyyyyyy Results: ",results);
    
  //   this.venuesFromGoogle = results;
  //   this.addMissingVal();
  // }

  // addMissingVal(){
    
  //   for(let i=0; i<this.venuesFromGoogle.length; i++){

  //     this.venuesFromGoogle[i].likes = null;
  //     this.venuesFromGoogle[i].discount_percentage = null;
  //     if(this.venuesFromGoogle[i].photos){
  //       // console.log("venuesFromGoogle[i].photos",this.venuesFromGoogle[i].photos[0].getUrl());
        
  //       this.venuesFromGoogle[i].cover_images = this.venuesFromGoogle[i].photos[0].getUrl();
  //     }else{
        
  //       this.venuesFromGoogle[i].cover_images = this.venuesFromGoogle[i].icon;
  //     }
  //     if(this.venuesFromGoogle[i].opening_hours){

  //       // console.log("venuesFromGoogle[i].opening_hours.isOpen()",this.venuesFromGoogle[i].opening_hours.isOpen());
  //     }
      
  //     this.venuesFromGoogle[i].lattitude = this.venuesFromGoogle[i].geometry.location?.lat();
  //     this.venuesFromGoogle[i].longitude = this.venuesFromGoogle[i].geometry.location?.lng();

  //     // Venue coordinates
  //     const venueLatitude = this.venuesFromGoogle[i].lattitude // Venue's latitude
  //     const venueLongitude = this.venuesFromGoogle[i].longitude // Venue's longitude

  //     // Calculate the distance between the user and the venue
  //     const distance = this.calculateDistance(this.latitude, this.longitude, venueLatitude, venueLongitude);

  //     // console.log('Distance (in miles):', distance);
  //     this.venuesFromGoogle[i].distance = distance
  //     this.venuesFromGoogle[i].googleRating = this.venuesFromGoogle[i].rating
  //     this.venuesFromGoogle[i].google_place_id = this.venuesFromGoogle[i].place_id
  //     this.venuesFromGoogle[i].close_hours = this.venuesFromGoogle[i].opening_hours?.isOpen();
      
  //     this.venuesFromGoogle[i].location = this.venuesFromGoogle[i].vicinity  
      
  //     if(this.venuesFromGoogle[i].types){
  //       this.venuesFromGoogle[i].description = this.venuesFromGoogle[i].types.join(', ')
  //     }
      
  //     this.venuesFromGoogle[i].status =  this.venuesFromGoogle[i].business_status;
  //     this.venuesFromGoogle[i].venues_id =  null;
  //     this.venuesFromGoogle[i].public_check_ins =  0;
  //     this.venuesFromGoogle[i].availability =  'null';
      
  //   }

  //   console.log("venuesFromGoogle: ",this.venuesFromGoogle);
  //   this.venuarr = this.venuarr.concat(
  //     this.venuesFromGoogle.sort((a: any, b: any) => {
  //       // console.log("testppppppppppopopopopopoopopopopopopopopo");
  //       return a.distance - b.distance;
  //     })
  //   );
  //   this.rest.venuArrHome = this.venuarr;
  //   console.log('venuArrUpdatedGoogleEvents: ',this.rest.venuArrHome);
  //   this.filteredvenuarr = this.venuarr;
  //   console.log('filteredVenuArrUpdatedGoogleEvents: ',this.filteredvenuarr);
  // }

  // async getAddress(lat:any, lng:any) {
  //   let address:any;
  //   this.geoCoder
  //     .geocode({ location: { lat: lat, lng: lng } })
  //     .subscribe(
  //       (addr: MapGeocoderResponse) => {
  //         console.log("Addressss: ",addr);
  //         address = addr;
          
  //         if (address.status === "OK") {
  //           if (address.results.length) {
  //             for(let i = 0; i<address.results.length; i++){ 
  //               if(address.results[i].types.length == 3){
  //                 console.log("address found===", address.results[i].formatted_address);
  //                 return address.results[i].formatted_address;
  //               }
  //             }
  //           } else {
  //             return "";
  //             window.alert("No results found");
  //           }
  //         } else {
  //           return "";
  //           window.alert("Geocoder failed due to: " + addr.status);
  //         }
  //       },
  //       (err) => {
  //         console.log("Errrrr",err);
  //       }
  //     );
  // }

  // Function to calculate the distance between two coordinates using the Haversine formula
  // calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  //   const earthRadius = 6371; // Radius of the Earth in kilometers
  //   const dLat = this.toRad(lat2 - lat1);
  //   const dLon = this.toRad(lon2 - lon1);

  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const distance = earthRadius * c;
    
  //   //  Convert the distance from kilometers to miles
  //   const distanceInMiles = distance * 0.621371;
  //   return distanceInMiles;
  // }

  // Function to convert degrees to radians
  // toRad(degrees: number): number {
  //   return (degrees * Math.PI) / 180;
  // }
//  =================================code end==================================================
  

  tab1Click() {
    this.HideFilter();
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.HideFilter();
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.HideFilter();
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.HideFilter();
    this.router.navigate(["noti"]);
  }


  async getCurrentPosition() {
    const getCurrentLocation = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    console.log("Current Location: ", getCurrentLocation);
    this.latitude = getCurrentLocation.coords.latitude;
    this.longitude = getCurrentLocation.coords.longitude;
    console.log("getCurrentPositionCalled");
    
    console.log("Latitude123: ", this.latitude);
    console.log("Longitude123: ", this.longitude);
    
  
  }

  goToProfile() {
    this.HideFilter();
    this.router.navigate(["profile"]);
  }

  segmentChanged(event: any) {
    this.HideFilter();
    console.log(this.segmentModel);
    // this.type = ev
    console.log("eee", event);
    this.scrollToTop();
  }

  //  set claimed venue rem time
  goToVenuDetail(opt: any) {
    console.log("detail opt",opt);
    
    this.getVenuesSuggested(opt);
    this.setClaimedVenueRemTime();
  }

  
  getVenuesSuggested(opt: any) {
    let data = {
      // longitude:"71.4706624",
      // lattitude:"30.2170521",
      longitude: this.longitude,
      lattitude: this.latitude,
      venues_id: opt.venues_id,
      users_customers_id: this.userID,
    };
    this.rest.presentLoader();
    this.rest.sendRequest("venues_suggested", data).subscribe(
      (res: any) => {
        this.rest.dismissLoader();
        console.log("Response venues_suggested : ", res);
        if (res.status == "success") {
          this.venueList = [];
          this.venueList.push(opt);
          for(let i=0; i<res.data.length; i++){
            this.venueList[i+1] = res.data[i];
          }
          // res.data.push(opt);
          // this.venueList = res.data;
          // // this.venueList.push(res.data);
          console.log("Response venues_suggested123: ",this.venueList);
          
          this.showVenueModal();
        } else {
          this.venueList = [];
          this.HideFilter();
          console.log("opt: ",opt);
          this.rest.detail = opt;
          this.rest.comingFrom = 'home';
          this.router.navigate(["venuedetail"]);
        }
      },
      // (err) => {
      //   this.rest.dismissLoader();
      //   console.log("API Errror: ", err);
      // }
    );
  }

  setClaimedVenueRemTime(){
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    let totalMinutes = 0;
    if(this.claimedVenues.length){
      for(let venue of this.claimedVenues){
        const resultMinutes = eachMinuteOfInterval({
          start: new Date(venue.claimed_date),
          end: new Date()
        });
        totalMinutes = resultMinutes.length;
        // console.log(totalMinutes);
        hours = Math.floor(totalMinutes / 60) ;
        minutes = totalMinutes % 60;
        seconds = 0;
        // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
        if(hours <= 23){
          hours = 23 - hours;
          minutes = 59 - minutes;
          seconds = 59 - seconds;
          venue.remaining_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        }else{
          venue.remaining_time = null;
        }
       
        
        // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
      }
      this.rest.claimedVenues = this.claimedVenues;
      console.log("claimed venues: ",this.claimedVenues);
      
    }
  }

  // done

  async showVenueModal() {
    const modal = await this.modalCtrlr.create({
      component: SelectVenuePopupPage,
      cssClass: "select_venue",
      componentProps: { venue_list: this.venueList },

      // cssClass: (result>24)? 'cancel_booking' : 'cancel_booking2',
      showBackdrop: true,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === "value_sent") {
      console.log("data123: ",data);
      this.selectedVenueName = data;
      console.log("selectedVenueName:", this.selectedVenueName);
      for (let dt of this.venueList) {
        // console.log("selectedVenueNameinLoop:", this.selectedVenueName);
        console.log("Entered in loop");
        // console.log(dt);
        // console.log(dt.name);
        this.selectedVenue = {};
        // console.log(this.selectedVenue);

        if (dt.name == this.selectedVenueName) {
          this.selectedVenue = dt;
          this.HideFilter();
          console.log(this.selectedVenue);
          this.rest.detail = this.selectedVenue;
          this.rest.comingFrom = 'home';
          this.router.navigate(["venuedetail"]);
        }
      }
    }
  }

  goToReservationDetail(ev: any) {
    this.setClaimedVenueRemTime();
    console.log(ev);
    this.rest.detail = ev;
    this.rest.comingFrom = 'home';
    this.router.navigate(["venuedetail"]);
  }

  goToEventDetail(opt: any) {
    this.HideFilter();
    console.log(opt);
    this.rest.detail = opt;
    this.rest.comingFrom = 'home';
    this.router.navigate(["eventdetail"]);
  }

  showHideFilter(item: any) {
    this.searchAndFilterItems(item);

    this.filtertype = item;

    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }
  }

  showHideFilterN() {
    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }
  }

  HideFilter() {
    this.showfilter = false;
  }

  likeevent(obj: any) {
    this.HideFilter();
    console.log("likeevent", obj);

    if (obj.likes == 0) {
      obj.likes = 1;
      this.likeDislikeUSerEvents(obj.events_id);
    }
  }

  likeoutevent(obj: any) {
    this.HideFilter();
    console.log("likeoutevent", obj);

    if (obj.likes == 1) {
      obj.likes = 0;
      this.likeDislikeUSerEvents(obj.events_id);
    }
  }

  likeDislikeUSerEvents(events_id: any) {
    console.log(events_id);

    var ss = JSON.stringify({
      users_customers_id: this.userID,
      events_id: events_id,
    });

    console.log(ss);

    this.rest.events_like_unlike(ss).subscribe((res: any) => {
      console.log(res);
    });
  }

  likevenu(obj: any) {
    this.HideFilter();
    console.log("likevenu", obj);

    if (obj.likes == 0) {
      obj.likes = 1;
      this.likeDislikeUServenu(obj.venues_id);
    }
  }

  likeoutvenu(obj: any) {
    this.HideFilter();
    console.log("likeoutvenu", obj);

    if (obj.likes == 1) {
      obj.likes = 0;
      this.likeDislikeUServenu(obj.venues_id);
    }
  }

  likeDislikeUServenu(events_id: any) {
    console.log(events_id);
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: events_id,
    });

    console.log(ss);
    this.rest.venues_like_unlike(ss).subscribe((res: any) => {
      console.log(res);
    });
  }

  searchAndFilterItems(searchTerm: any) {
    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      if (
        this.venuarrOrg[i].availability.toLowerCase() ==
        searchTerm.toLowerCase()
      ) {
        this.venuarr.push(this.venuarrOrg[i]);
      }
    }

    console.log("item------", this.venuarr);
  }

  clearFilter() {
    this.HideFilter();
    this.filtertype = "no";
    this.venuarr = this.venuarrOrg;
    this.noevenu = 0;
  }

  removeReservationFilter() {
    // this.HideFilter();
    this.reservationFilter = "no";
    this.filteredReservationsArr = this.reservationsArr;
    this.noReservations = 0;
  }

  clearFilterEv(){
    this.filterTypeEv = 'no'
    this.eventarr = this.eventsArrayCopy;
    this.noevent = 0;
  }
  
  userdata: any = "";
  userID : any = "";
  records_limit: any = 0;
  
  ionViewWillEnter() {

    this.getSystemSettings();
    this.getCurrentPosition();
    
    this.filtertype = "no";
    this.records_limit = localStorage.getItem("records_limit");
    this.noevent = 0;
    this.noReservations = 0;
    this.noevenu = 0;
    this.userdata = localStorage.getItem("userdata");
    this.pageNumber = 1;
    console.log("records_limit----", this.records_limit);
    this.userID = JSON.parse(this.userdata).users_customers_id;
    this.alwaysSendCurrentLocation();
    this.getClaimedVenues();
    this.getVenueAIKeywords();
    this.getEventAIKeywords();
    this.getVenues();
    this.ai = JSON.parse(this.userdata).ai_feature;
    // this.segmentModel = 'venu';
    if (this.ai == "No") {
      this.aiToggleChecked = false;
    } else {
      this.aiToggleChecked = true;
    }
   
  }

  getVenues(){
    this.noevenu = 0;
    this.pageNumber = 1;
    this.filtertype = "no";
    console.log('get venues called');
    
    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });

    if(this.venuarr.length == 0){ 
      this.rest.presentLoader();
    }
    
    this.rest.venues(ss).subscribe((res: any) => {
      console.log("venues---", res);
      if(this.venuarr.length == 0){
        
        this.rest.dismissLoader();
      }

      if (res.status == "success") {
        for(let i=0; i<res.data.length; i++){
          res.data[i].cover_images =  `${this.rest.baseURLimg}${res.data[i].cover_image}`
        }
        this.venuarr = res.data.sort((a: any, b: any) => {
          return a.distance - b.distance;
        });

        

        console.log('venuArray: ',this.venuarr);
        
        // //FILTER VENUES NEAR USER LOCATION
        // this.getVenuesNearUserLocation();

        this.rest.venuesArray = this.venuarr;
        console.log("this.rest.venuesArray: ",this.rest.venuesArray);
        
        this.venuarrOrg = this.venuarr;
        console.log('venuarrOrg: ',this.venuarrOrg);
        
        this.filteredvenuarr = this.venuarrOrg;
        this.rest.venuArrHome = this.venuarr;
        
        console.log('venuArrHome: ',this.rest.venuArrHome);
      } else {
        // this.rest.presentToast(res.message);
        this.noevenu = 1;
        this.venuarr  = [];
        this.rest.venuesArray = [];
        this.venuarrOrg = [];
        this.filteredvenuarr = [];
        this.rest.venuArrHome = [];
      }
      // this.initialize();
    });
  }

  getReservations(){
    this.noReservations = 0;
    this.pageNumber = 1;
    this.reservationFilter = "no";
    console.log('get Reservations called');

    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });

    if(this.filteredReservationsArr.length == 0){
        
      this.rest.presentLoader();
    }
    
    this.rest.reservations(ss).subscribe((res:any)=>{
      console.log("get reservations res: ",res);
      if(this.filteredReservationsArr.length == 0){
        
        this.rest.dismissLoader();
      }
      
        if(res.status == 'success'){
          for(let i=0; i<res.data.length; i++){
            res.data[i].cover_images =  `${this.rest.baseURLimg}${res.data[i].cover_images}`;
          }
          this.reservationsArr = res.data.sort((a: any, b: any) => {
            return a.distance - b.distance;
          });
          this.filteredReservationsArr = this.reservationsArr;
          
          console.log("Reservations Array: ",this.reservationsArr);
          
        }
        else{
          this.noReservations = 1;
          this.reservationsArr = [];
          this.filteredReservationsArr = [];
        }
    });
  }

  getEvents(){
    this.noevent = 0;
    this.pageNumber = 1;
    this.filterTypeEv = "no";
    console.log('get Events called');

    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });
    if(this.eventarr.length == 0){ 
      this.rest.presentLoader();
    }
    
    this.rest.events(ss).subscribe((res: any) => {
      console.log("events---", res);
      if(this.eventarr.length == 0){
        
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.eventarr = res.data.sort((a: any, b: any) => {
          // console.log("test");
          return a.distance - b.distance;
        });
        // for(let event of this.eventarr){
        //   if(event.event_start_time != null && event.event_end_time != null){
        //     //parse date
        //     let start_time;
        //     let end_time;
        //     // parse in date object format
        //     start_time = parse(event.event_start_time, 'HH:mm:ss', new Date());
        //     end_time = parse(event.event_end_time, 'HH:mm:ss', new Date());
        //     //format the date
        //     start_time = format(start_time, 'h:mm aaaa');
        //     end_time = format(end_time, 'h:mm aaaa');
        //     // console.log('startTime',start_time);
        //     // console.log('endTime',end_time);
        //     event.formatted_start_time = start_time;
        //     event.formatted_end_time = end_time;
            
        //   }
        // }
        this.eventsArrayCopy = this.eventarr
      } else {
        // this.rest.presentToast(res.message);
        this.noevent = 1;
        this.eventarr = [];
        this.eventsArrayCopy = [];
      }
    });
  }

  getSystemSettings(){
    this.rest.system_settings().subscribe((res:any)=>{
      console.log("system_settings res: ",res);
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].type == "reservation_feature") {
          this.reservationFeature = res.data[i].description;
          console.log("reservationFeature: ",this.reservationFeature);
        }
      }
    });
  }

  handleRefresh(ev: any) {
    console.log("ev123-----", ev);
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    this.ionViewWillEnter();
  }
  
  onIonInfinite(ev: any, value:String) {
    console.log("ev123InFinite",ev);
    
    this.pageNumber++;
    console.log("ev-----", this.pageNumber);
    console.log("records_limit-----", localStorage.getItem("records_limit"));
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    
    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });
    console.log("OnIonInfiniete data ss", ss);
    this.rest.presentLoaderWd();
    if(value == 'events'){
      this.rest.events(ss).subscribe((res: any) => {
        console.log("events---", res);
        this.rest.dismissLoader();
        
        if (res.status == "success") {
          this.eventarr = this.eventarr.concat(
            res.data.sort((a: any, b: any) => {
              return a.distance - b.distance;
            })
          );
        } else {
          // this.rest.presentToast(res.message);
          // this.noevent = 1;
        }
      });
    }
    else if(value == 'venues'){
      this.rest.venues(ss).subscribe((res: any) => {
        console.log("updated venues response---", res);
        this.rest.dismissLoader();
        if (res.status == "success") {
          for(let i=0; i<res.data.length; i++){
            res.data[i].cover_images =  `${this.rest.baseURLimg}${res.data[i].cover_image}`;
          }
          this.venuarr = this.venuarr.concat(
            res.data.sort((a: any, b: any) => {
              // console.log("testppppppppppopopopopopoopopopopopopopopo");
              return a.distance - b.distance;
            })
          );
          // this.getVenuesNearUserLocation();
          console.log("Updated Venu Array",this.venuarr);
          
          this.venuarrOrg = this.venuarr;
          // this.venuarrOrg = this.venuarr.concat(
            //   res.data.sort((a: any, b: any) => {
              //     // console.log("testppppppppppopopopopopoopopopopopopopopo");
              //     return a.distance - b.distance;
              //   })
              // );
          this.filteredvenuarr = this.venuarr;
          console.log("Updated filtered Venu Array",this.venuarr);
          this.rest.venuArrHome = this.venuarr
          // this.rest.venuArrHome = this.venuarr.concat(
          //   res.data.sort((a: any, b: any) => {
          //     // console.log("testppppppppppopopopopopoopopopopopopopopo");
          //     return a.distance - b.distance;
          //   })
          // );
          
  
        } else {
          // this.rest.presentToast(res.message);
          // this.noevenu = 1;
        }
        // if(this.pageNumber == 2){
        //   this.initialize();
        // }
      });
    }
    else if(value == 'reservations'){
      this.rest.reservations(ss).subscribe((res:any)=>{
        this.rest.dismissLoader();
        if(res.status == 'success'){
          for(let i=0; i<res.data.length; i++){
            res.data[i].cover_images =  `${this.rest.baseURLimg}${res.data[i].cover_images}`;
          }
          this.reservationsArr = this.reservationsArr.concat(res.data.sort((a: any, b: any) => {
            return a.distance - b.distance;
          }));

          this.filteredReservationsArr = this.reservationsArr;
          
          console.log("Updated Reservations Array: ",this.reservationsArr);
          
        }
        else{
          // this.noReservations = 1;
        }
      });
    }
    else{}
  
  }

  searchReservations(event: any) {
    this.filteredReservationsArr = [];
    for (var i = 0; i < this.reservationsArr.length; i++) {
      // console.log(this.venuarrOrg[i].name.toLowerCase());
      console.log(event.target.value.toLowerCase());

      if (
        this.reservationsArr[i].name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        this.filteredReservationsArr.push(this.reservationsArr[i]);
      }
    }

    console.log("item------", this.filteredReservationsArr);
  }

  searchEvents(event: any) {
    
    this.eventarr = [];
    for (var i = 0; i < this.eventsArrayCopy.length; i++) {
      // console.log(this.venuarrOrg[i].name.toLowerCase());
    //   console.log(event.target.value.toLowerCase());

      if (
        this.eventsArrayCopy[i].name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        this.eventarr.push(this.eventsArrayCopy[i]);
      }
    }

    // console.log("item------", this.filteredvenuarr);
  }

  async goToFilter() {
    console.log("model123fdd");
    const modal = await this.modalCtrlr.create({
      component: FilterPage,
      cssClass: "riz",
    });

    await modal.present();

    const {data,role} = await modal.onWillDismiss();
    if(role == 'success'){
      let filteredEvents = [];
      // console.log("data recieved",data);
      let date = data.eventDate;
      let address = data.address;
    
      let filterAddressTokens = [];
      let eventAddressTokens = [];
      if(date === 'Date' && address !== undefined ){
        // filter by address
        
        filterAddressTokens = address.split(',');
        console.log("filterAddressTokens",filterAddressTokens);
        
        for(let i=0; i<this.eventsArrayCopy.length; i++){
          // console.log(this.eventsArrayCopy[i]);
          eventAddressTokens = this.eventsArrayCopy[i].location.split(',');
          if(eventAddressTokens[0] == filterAddressTokens[0]){
            filteredEvents.push(this.eventsArrayCopy[i]);
          }

        }
      }else if(date !== 'Date' && address === undefined){
        // filter by date
        for(let i=0; i<this.eventsArrayCopy.length; i++){
          // console.log(this.eventsArrayCopy[i]);
          if(this.eventsArrayCopy[i].event_date == date){
            filteredEvents.push(this.eventsArrayCopy[i]);
          }
        }
      }
      else if(date !== 'Date' && address !== undefined){
        // filter by date and address

        filterAddressTokens = address.split(',');
        console.log("filterAddressTokens",filterAddressTokens);

        for(let i=0; i<this.eventsArrayCopy.length; i++){
          // console.log(this.eventsArrayCopy[i]);
          eventAddressTokens = this.eventsArrayCopy[i].location.split(',');
          if(eventAddressTokens[0] == filterAddressTokens[0] && this.eventsArrayCopy[i].event_date == date){
            filteredEvents.push(this.eventsArrayCopy[i]);
          }
        }
      }else{

      }
      this.filterTypeEv = 'yes';
      this.eventarr = filteredEvents;
      if(this.eventarr.length == 0){
        this.noevent = 1;
      }else{
        this.noevent = 0;
      }
      console.log("Ev Arr...", this.eventarr);
    }else if(role == 'error'){
      // this.filterTypeEv = 'yes';
      // this.eventarr = data;
      // console.log("Ev Arr...", this.eventarr);
    }else{

    }


  }


  gotoEventDetail(){
    this.rest.comingFrom = 'home';
    this.router.navigate(["eventdetail"]);
  }

}



