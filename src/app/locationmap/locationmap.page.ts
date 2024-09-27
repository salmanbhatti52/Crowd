import { RestService } from "./../rest.service";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";

import { IonModal, ModalController, Platform } from "@ionic/angular";
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
  MapMarker,
  MapDirectionsService,
} from "@angular/google-maps";
import { Observable, map,of } from "rxjs";
import { Keyboard } from '@capacitor/keyboard';
import { OverlayEventDetail } from '@ionic/core/components';
import { SearchComponentComponent } from "../search-component/search-component.component";
import { IonInput } from "@ionic/angular";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { format, getDay, isEqual, parse, parseISO } from "date-fns";
// import  { Screenshot } from 'capacitor-screenshot';

import {AnimationOptions  } from 'ngx-lottie';
@Component({
  selector: "app-locationmap",
  templateUrl: "./locationmap.page.html",
  styleUrls: ["./locationmap.page.scss"],
})
export class LocationmapPage implements OnInit {
  ////angular map

  @ViewChild("search")
  public searchElementRef!: ElementRef;
  @ViewChild("myGoogleMap", { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;
  @ViewChild("textInput", { static: false })
  textInput!: ElementRef;
  @ViewChild(IonModal)
  modal!: IonModal;
  @ViewChild('welcomeMessage', { static: false })
  welcomeMessage!: ElementRef;

  foundVenue :any;

  userID: any = "";
  userdata: any = "";
  address = "";
  latitude!: any;
  longitude!: any;
  zoom = 12;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: "roadmap",
    disableDefaultUI: true,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },

      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };
  renderOptions: google.maps.DirectionsRendererOptions = {
    suppressMarkers:true,
    polylineOptions: {
      strokeColor: '#FFFFFF', 
      // strokeOpacity: 0.5,
      strokeWeight:5
    }
  }
  // public styleDark = [
  //   {
  //     elementType: "geometry",
  //     stylers: [
  //       {
  //         hue: "#ff4400",
  //       },
  //       {
  //         saturation: -100,
  //       },
  //       {
  //         lightness: -4,
  //       },
  //       {
  //         gamma: 0.72,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "road",
  //     elementType: "labels.icon",
  //   },
  //   {
  //     featureType: "landscape.man_made",
  //     elementType: "geometry",
  //     stylers: [
  //       {
  //         hue: "#0077ff",
  //       },
  //       {
  //         gamma: 3.1,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "water",
  //     stylers: [
  //       {
  //         hue: "#000000",
  //       },
  //       {
  //         gamma: 0.44,
  //       },
  //       {
  //         saturation: -33,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "poi.park",
  //     stylers: [
  //       {
  //         hue: "#44ff00",
  //       },
  //       {
  //         saturation: -23,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "labels.text.fill",
  //     stylers: [
  //       {
  //         hue: "#007fff",
  //       },
  //       {
  //         gamma: 0.77,
  //       },
  //       {
  //         saturation: 65,
  //       },
  //       {
  //         lightness: 99,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "labels.text.stroke",
  //     stylers: [
  //       {
  //         gamma: 0.11,
  //       },
  //       {
  //         weight: 5.6,
  //       },
  //       {
  //         saturation: 99,
  //       },
  //       {
  //         hue: "#0091ff",
  //       },
  //       {
  //         lightness: -86,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "transit.line",
  //     elementType: "geometry",
  //     stylers: [
  //       {
  //         lightness: -48,
  //       },
  //       {
  //         hue: "#ff5e00",
  //       },
  //       {
  //         gamma: 1.2,
  //       },
  //       {
  //         saturation: -23,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "transit",
  //     elementType: "labels.text.stroke",
  //     stylers: [
  //       {
  //         saturation: -64,
  //       },
  //       {
  //         hue: "#ff9100",
  //       },
  //       {
  //         lightness: 16,
  //       },
  //       {
  //         gamma: 0.47,
  //       },
  //       {
  //         weight: 2.7,
  //       },
  //     ],
  //   },
  //   {
  //     featureType: "water",
  //     elementType: "geometry",
  //     stylers: [
  //       {
  //         color: "#222222",
  //       },
  //     ],
  //   },
  // ];

  public defaultStyle = [];
  markers = [] as any;
  eventMarkers = [] as any;

  //// angular map
  showCrowdfilters = false;

  currentLatitude:any;
  currentLongitude:any;

  title = "Title here";
  venuarr: any = "";
  eventarr: any = "";
  venuarrOrg: any = "";
  eventArrOrg: any = "";

  filtertype = "no";
  // filterTypeEv = "no";
  showSideElements = true;
  searchObject: any = "";
  searchEventObject: any = "";
  markerscheck = [];

  dbLati: any = "";
  dbLong: any = "";

  a: any = "";
  b: any = "";
  ss: any;

  selectedVenueCat = '';
  selectedEventCat = '';
  selectedCrowdCat = '';
  userLocation:any;
  directionsResults$!: Observable<google.maps.DirectionsResult | undefined>;
  showCategories = false;
  showEventCategories = false;
  showDetail = false;
  showEventDetail = false;
  yourVoiceInput = '';
  listener: boolean = false;
  listeningStatus:string = '';
  listening:boolean = false;
  ai = '';
  aiToggleChecked: boolean = false;
  isAnimating = false;
  timeout:any;
  inactivityDelay = 5000;
  deniedVoicePermissionCount = 0;
  toggleThemeChecked = true;
  
  venueKeywords: any = [];
  eventKeywords:any = [];

  dayTimeKeywords:string[] = ['until','till','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00', '1','2','3','4','5','6','7','8','9','10','11','12', 'a.m.', 'p.m.', 'tonight'];
  // lottieConfig!: AnimationOptions;
  typedText:any = '';

  inputFeatureActive = false;
  keyboardIsVisible = false;
  allVenueEventMarkers: any;
  // showMicIcon = false;

  constructor(
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    private ngZone: NgZone,
    private geoCoder: MapGeocoder,
    private platform:Platform,
    private mapDirectionsService: MapDirectionsService,
    private changeDetectorRef: ChangeDetectorRef,
    // private mapDirectionsRenderer: MapDirectionsRenderer,
    private renderer: Renderer2
  ) {
    
    // this.lottieConfig = {
    //   path: 'assets/animation.json', // Path to your Lottie animation file
    //   renderer: 'svg', // 'svg', 'canvas', 'html'
    //   autoplay: true,
    //   loop: true,
    // };
  }
  // ngOnDestroy(): void {
  //   this.clearInactivityTimeout();
  //   throw new Error("Method not implemented.");
  // }

  clearSearchObject(){
    this.searchObject = '';
    this.infoContent = '';
    this.infoWindow.close();
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.getCurrentLocation();
    // this.renderOptions
  }

  clearSearchEventObject(){
    this.searchEventObject = '';
    this.infoContent = '';
    this.infoWindow.close();
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.getCurrentLocation();
    // this.renderOptions
  }

  ionViewWillLeave() {
    this.clearInactivityTimeout();
  }


  typeWriter() {
    SpeechRecognition.stop();
    this.inputFeatureActive = false;
    this.typedText = '';
    this.listening = false;
    this.yourVoiceInput = '';
    this.changeDetectorRef.detectChanges();
    


    if (!this.welcomeMessage) {
      console.error('welcomeMessage ViewChild not yet initialized');
      return;
    }

    const message = "Hello I'm Ora, here to uncover your ultimate social hotspot! How can I help?";
    let index = 0;

    const type = () => {
      if (index < message.length) {
        this.welcomeMessage.nativeElement.innerHTML += message.charAt(index);
        index++;
        setTimeout(type, 100); // Adjust the speed here (100 ms)
      }
    };

    type();
  }

  onModalDidPresent() {
    this.markers = this.allVenueEventMarkers;
    console.log('OnModalDidPresent Markers',this.markers);
    
    this.typeWriter();

  }

  toggleTheme(ev:any){
    // this.typedText = '';
    console.log(ev);
    
    this.toggleThemeChecked = !this.toggleThemeChecked;
    console.log(this.toggleThemeChecked);
    
  }

  showKeyboard(){
    // console.log('show keyboard called, stop speech recognition');
    // this.listening = false;
    // SpeechRecognition.stop();
    // this.clearInactivityTimeout();
  }

  onInputForAI(ev:any){
    console.log("input event triggered",ev);
    
    this.typedText = ev.target.value;
    console.log(this.typedText);
    
  }

  searchForAIInput(ev:any){
    
    // console.log('ion Blur input',ev);
    // if(this.typedText != ''){
    //   this.dismissModal();
    //   this.findResults(this.typedText);
    // }
    
  }

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

  async requestPermissions(): Promise<string>{

    try {
      const permissionStatus = await SpeechRecognition.requestPermissions();
      console.log("PermissionStatus: ", permissionStatus);
      if (permissionStatus.speechRecognition !== 'granted') {
        return 'denied';
      }
      return 'granted';
    } catch (error) {
      console.error("Error requesting permissions: ", error);
      return 'denied';  // Ensure a string is always returned even in case of an error
    }
   
   
  }

  async startSpeechRecognition(){
    this.inputFeatureActive = true;
    // this.typedText = '';
    // this.listening = false;
    
    // SpeechRecognition.stop();
    // this.yourVoiceInput = '';

    let checkPermissionsStatus = (await SpeechRecognition.checkPermissions()).speechRecognition;
    console.log('checkPermissionsResult: ',checkPermissionsStatus);

    if(checkPermissionsStatus!== "granted"){
      if(!this.platform.is("mobileweb")){
        console.log('Requesting permissions');
        
        let permissionStaus =  await this.requestPermissions();
        console.log("PermissionStatus 2",permissionStaus);
       
        if(permissionStaus === 'granted'){
          checkPermissionsStatus = 'granted';
        }
        else{
          this.rest.deniedVoicePermissionCount++;
        }
      }
    }

    this.venuarr = this.venuarrOrg;
    this.eventarr = this.eventArrOrg;

    const {available} = await SpeechRecognition.available();
    console.log('availability res: ',available);

    if( checkPermissionsStatus === 'granted' && available){

      this.setInactivityTimeout();
      // ===========speech start try catch====================
      
      try {
        SpeechRecognition.start({
          language: "en-US",
          popup: false,
          partialResults:true,
        });
      } catch (error) {
        console.log("Speech Start error: ",error);
      }

      this.listening = true;
      this.changeDetectorRef.detectChanges();
      // ===========partial results try catch====================
      
      try {
        SpeechRecognition.addListener("partialResults", async (data: any) => {
          // console.log("partialResults was fired", data.matches);
          if(data.matches && data.matches.length > 0){  
            // if(this.listener == true){
              this.yourVoiceInput = data.matches[0];
              this.changeDetectorRef.detectChanges();
              this.resetInactivityTimeout();
            // }
          }
          
        });
      } catch (error) {
        console.log('partial results error:',error);
      } 

      // ===========listening state try catch====================

      try {
        SpeechRecognition.addListener('listeningState',(data:{status: "started" | "stopped"})=>{
          if(data.status == "started"){
            this.listeningStatus = data.status;
            console.log("listening Status: ",this.listeningStatus);
            // this.listening = true;  
            // this.showAnimation();
          }
          else{
           
            this.listeningStatus = data.status;
            console.log("listening Status: ",this.listeningStatus);
            // this.hideAnimation();
          }
        });
      } catch (error) {
        console.log("Listening state error: ",error);
        
      }

      let result  = SpeechRecognition.isListening();
      console.log("isListening: ",result);
      
    }
    else{
      if(this.rest.deniedVoicePermissionCount>=2){
        this.rest.presentToast('Voice recording denied; reinstall app to enable AI feature.');
      }
      this.dismissModal();
    }
    
  }

  setInactivityTimeout(){
    this.clearInactivityTimeout();
    this.timeout = setTimeout(() => {
      this.stopSpeechRecognition();
    }, this.inactivityDelay);
  }

  resetInactivityTimeout(){
    this.setInactivityTimeout();
  }

  clearInactivityTimeout(){
    if(this.timeout){
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  showAnimation() {
    this.isAnimating = true;
  }

  hideAnimation() {
    this.isAnimating = false;
  }

  async stopSpeechRecognition(){
    this.searchObject= '';
    this.searchEventObject = '';
   
    SpeechRecognition.stop();
    this.listening = false;
    if(this.yourVoiceInput == ''){
      this.inputFeatureActive = false;
    }
    console.log('input feature active: ',this.inputFeatureActive);
    
    this.changeDetectorRef.detectChanges();
    
    this.clearInactivityTimeout();

    // this.yourVoiceInput = 'Pizza shopp having 30% off';
    if(this.yourVoiceInput !='' ){   
      this.dismissModal();   
      this.findResults(this.yourVoiceInput);
    }
  }


  findResults(userInput:string){
    this.typedText = '';
    this.yourVoiceInput = '';
    console.log('userInput: ',userInput);
    
    userInput = userInput.toLowerCase();
    let tokens = userInput.split(/\s+/);
    console.log(tokens);
    if(tokens.includes('venue') || tokens.includes('avenue')){
      this.findVenueAndDiscount(tokens);
    }else{
      this.findEventAndDiscount(tokens);
    }
    
  }

  findVenueAndDiscount = (inputTokens:string[]) => {
    console.log('inputTokens: ',inputTokens);
    
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
        foundVenueName = this.filterVenuesForAI(inputTokens, venueNameTokens);
        console.log('foundVenueName: ',foundVenueName);
      
        foundDiscount = this.filterVenuesForAI(inputTokens,venueDiscount.split(/\s+/));
        console.log('foundDiscount: ',foundDiscount);
        
        foundNamedLocation = this.filterVenuesForAI(inputTokens, venueLocationNameTokens);
        console.log('foundNamedLocation: ',foundNamedLocation);
    
      }else if(foundWords.length >0){

        foundNamedLocation = this.filterVenuesForAI(inputTokens, venueLocationNameTokens);
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
    console.log("filteredVenues: ",filteredVenues)
    this.venuarr = filteredVenues;

    this.setMarkersForFoundVenues(filteredVenues);
    
  };

  findEventAndDiscount = (inputTokens:string[]) => {
    // this.noevent = 0;
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

    // this.filterTypeEv = 'yes';
    console.log("filteredEvents: ",filteredEvents); 
    this.eventarr = filteredEvents;

    if(filteredEvents.length == 0){
      // this.noevent = 1;
    }else{
      this.setMarkersForFoundEvents(filteredEvents);
      // this.noevent = 0;
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
           
          }else{
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

  filterVenuesForAI(inputTokens:string[], targetTokens:string[]){
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

  setMarkersForFoundVenues = (foundVenues:any) => {
    this.directionsResults$ =of<google.maps.DirectionsResult | undefined>(undefined);
    this.showDetail = false;
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.venuarr = [];
    this.markers = [];
    console.log("Venuarr foundVenues: ",foundVenues);
    
    for (var i = 0; i < foundVenues.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(foundVenues[i].lattitude),
          lng: parseFloat(foundVenues[i].longitude),
        },
        title: "" + foundVenues[i].availability_count,
        name: foundVenues[i].name,
        venueId: foundVenues[i].venues_id,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };

      this.venuarr.push(obj);
    }

    this.markers = this.venuarr;
    console.log("Venuarr : ",this.venuarr);
    console.log("markersArr : ",this.markers);
    this.showCategories = false;
  }

  setMarkersForFoundEvents = (foundEvents:any) => {
    this.directionsResults$ =of<google.maps.DirectionsResult | undefined>(undefined);
    this.showEventDetail = false;
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.eventarr = [];
    this.markers = [];
    console.log("Eventarr founEvents: ",foundEvents);
    
    for (var i = 0; i < foundEvents.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(foundEvents[i].lattitude),
          lng: parseFloat(foundEvents[i].longitude),
        },
        title: "" + foundEvents[i].availability_count,
        name: foundEvents[i].name,
        eventId: foundEvents[i].events_id,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };

      this.eventarr.push(obj);
    }

    this.markers = this.eventarr;
    console.log("EventArr : ",this.eventarr);
    console.log("markersArr : ",this.markers);
    this.showEventCategories = false;
  }

  dismissModal(){
    console.log('stopSpeechRecognition');
    this.showCrowdfilters= false;
    this.showCategories= false;
    this.showEventCategories = false;
    SpeechRecognition.stop();
    this.modalCtrl.dismiss();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SearchComponentComponent,
      cssClass: "search_modal"
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.foundVenue = data;
      console.log("found venue:",this.foundVenue);
      this.setFoundVenue();
    }
  }

  setFoundVenue(){
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.showDetail = false;
    this.map.googleMap?.setZoom(13);
    
    // this.markers = [];
    this.venuarr = [];
           
    var obj = {
      position: {
        lat: parseFloat(this.foundVenue.lattitude),
        lng: parseFloat(this.foundVenue.longitude),
      },
      title: "" + this.foundVenue.availability_count,
      name: this.foundVenue.name,
      venueId: this.foundVenue.venues_id,
      options: {
        animation: google.maps.Animation.DROP,
        draggable: false,
        icon: {
          url: "assets/imgs/locpin2.svg",
          size: {
            height: 48,
            width: 48,
          },
        },
      },
    };

    this.venuarr.push(obj);

    this.markers = this.venuarr;
    this.openInfo(undefined,obj.title,obj);
    console.log("Venuarr : ",this.venuarr);
    console.log("markersArr : ",this.markers);
  }


  getDirections(){

    const request: google.maps.DirectionsRequest = {
      destination: {lat: +this.searchObject.lattitude, lng: +this.searchObject.longitude},
      origin: {lat: this.currentLatitude, lng: this.currentLongitude },
      travelMode: google.maps.TravelMode.DRIVING,

    };
    console.log(request.destination);
    console.log(request.origin);
    
    
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map((response:any) => response.result));
    this.rest.directionsResults$ = this.directionsResults$;
    console.log("directionsResults: ",this.rest.directionsResults$);
    // this.router.navigate(["see-path"]);
  }
  getEventDirections(){

    const request: google.maps.DirectionsRequest = {
      destination: {lat: +this.searchEventObject.lattitude, lng: +this.searchEventObject.longitude},
      origin: {lat: this.currentLatitude, lng: this.currentLongitude },
      travelMode: google.maps.TravelMode.DRIVING,

    };
    console.log(request.destination);
    console.log(request.origin);
    
    
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map((response:any) => response.result));
    this.rest.directionsResults$ = this.directionsResults$;
    console.log("directionsResults: ",this.rest.directionsResults$);
    // this.router.navigate(["see-path"]);
  }

  async ionViewWillEnter() {
   
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.a = localStorage.getItem("lattitude");
    this.b = localStorage.getItem("longitude");
    this.dbLati = parseFloat(this.a);
    this.dbLong = parseFloat(this.b);
    console.log("this.rest.venuArrHome",this.rest.venuArrHome.length);
    this.userdata = localStorage.getItem("userdata");
    this.ai = JSON.parse(this.userdata).ai_feature;

    if (this.ai == "No") {
      this.aiToggleChecked = false;
    } else {
      this.aiToggleChecked = true;
    }
    
    this.venuarrOrg = this.rest.venuArrHome;
    this.eventArrOrg = this.rest.eventArrHome;
    console.log("this.venuarrOrg",this.venuarrOrg.length);
    this.makeMarkerArray();
    this.makeEventMarkerArray();
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
    this.getVenueAIKeywords();
    this.getEventAIKeywords();
    console.log("dbLati---------", this.dbLati);
    console.log("dbLong---------", this.dbLong);

    this.getCurrentLocation();
    this.map.googleMap?.setZoom(13);
  }
  

  
  isIOS() {
    return this.platform.is('ios');
  }

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
  goToProfile() {
    // this.takeSc();
    this.HideFilter();
    this.router.navigate(["profile"]);
  }
  hideExtraElements(){
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.showDetail = false;
    this.map.googleMap?.setZoom(13);
    // this.showSideElements = false;
    this.infoWindow.close();
  }
  showHiddenElements(){
    // this.showSideElements = true;
  }

  searchVenues(ev:any){
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.showDetail = false;
    this.map.googleMap?.setZoom(13);
    
    // this.markers = [];
    this.venuarr = [];
    
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      if (
            this.venuarrOrg[i].name
              .toLowerCase()
              .includes(ev.target.value.toLowerCase())
          ) {
            this.markers = [];
            var obj = {
              position: {
                lat: parseFloat(this.venuarrOrg[i].lattitude),
                lng: parseFloat(this.venuarrOrg[i].longitude),
              },
              title: "" + this.venuarrOrg[i].availability_count,
              name: this.venuarrOrg[i].name,
              venueId: this.venuarrOrg[i].venues_id,
              options: {
                animation: google.maps.Animation.DROP,
                draggable: false,
                icon: {
                  url: "assets/imgs/locpin2.svg",
                  size: {
                    height: 48,
                    width: 48,
                  },
                },
              },
            };
      
            this.venuarr.push(obj);
          }
      
    }

    this.markers = this.venuarr;
    console.log("Venuarr : ",this.venuarr);
    console.log("markersArr : ",this.markers);
  }


  clearFilter() {
    this.HideFilter();
    this.filtertype = "no";
    this.venuarr = this.venuarrOrg;
    // this.setMarkersAgain();
    // console.log("this.venuarr",this.venuarr);
    
    // var newVenuArr = [];
    // for (var i = 0; i < this.venuarr.length; i++) {
    //   var obj = {
    //     position: {
    //       lat: parseFloat(this.venuarr[i].lattitude),
    //       lng: parseFloat(this.venuarr[i].longitude),
    //     },
    //     title: "" + this.venuarr[i].availability_count,
    //     name: this.venuarr[i].name,
    //     options: {
    //       animation: google.maps.Animation.DROP,
    //       draggable: false,
    //       icon: {
    //         url: "assets/imgs/locpin2.svg",
    //         size: {
    //           height: 120,
    //           width: 30,
    //         },
    //       },
    //     },
    //   };

    //   newVenuArr.push(obj);
    // }

    // this.venuarr = [];
    // this.venuarr = newVenuArr;
    // this.markers = this.venuarr;
    
  }

  

  async toggleCrowdFilter() {
    
    this.showCrowdfilters = !this.showCrowdfilters;
    this.showCategories = false;
    this.showEventCategories = false;
   
  }

  selectedCrowdFilter(item: any) {
    this.showCrowdfilters = !this.showCrowdfilters;
    this.selectedCrowdCat = item;
    this.searchObject = "";
    this.searchEventObject = "";
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.searchAndFilterItems(item);

    // this.filtertype = item;
   
  }

  toggleCategories(){
    
    this.showCategories = !this.showCategories;
    this.showCrowdfilters = false;
    this.showEventCategories = false;
  }

  selectedVenueCategory(val:any){
    console.log(val);
    this.selectedVenueCat = val;
    this.selectedCrowdCat = '';
    this.showCategories = !this.showCategories;
    this.searchObject = "";
    this.searchEventObject = "";
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.searchAndFilterVenuItems(val);
    // this.setMarkersAgain();
  }

  toggleEventCategories(){
    this.searchObject = "";
    this.searchEventObject = "";
    this.showEventCategories = !this.showEventCategories;
    this.showCrowdfilters = false;
    this.showCategories = false;
  }

  selectedEventCategory(val:any){
    console.log(val);
    this.selectedEventCat = val;
    this.selectedCrowdCat = '';
    this.showEventCategories = !this.showEventCategories;
    this.searchObject = "";
    this.searchEventObject = "";
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.searchAndFilterEventItems(val);
    // this.setEventMarkersAgain();
  }
  
  searchAndFilterItems(searchTerm: any) {
    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      if(this.selectedVenueCat!=''){
        if (
          this.venuarrOrg[i].availability.toLowerCase() ==
          searchTerm.toLowerCase() &&  this.venuarrOrg[i].venue_genre.toLowerCase() ==
          this.selectedVenueCat.toLowerCase()
        ) {
          this.venuarr.push(this.venuarrOrg[i]);
        }
      }else{
        if (
          this.venuarrOrg[i].availability.toLowerCase() ==
          searchTerm.toLowerCase()
        ) {
          this.venuarr.push(this.venuarrOrg[i]);
        }
      }
      
    }

    var newVenuArr = [];
    for (var i = 0; i < this.venuarr.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.venuarr[i].lattitude),
          lng: parseFloat(this.venuarr[i].longitude),
        },
        title: "" + this.venuarr[i].availability_count,
        name: this.venuarr[i].name,
        venueId: this.venuarr[i].venues_id,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };
      newVenuArr.push(obj);
    }

    this.venuarr = [];
    this.venuarr = newVenuArr;
    
    this.markers = this.venuarr;
    console.log('results: ',this.markers);
    
  }

  searchAndFilterVenuItems(searchTerm: any) {
    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      if(this.selectedCrowdCat!=''){
        if (
          this.venuarrOrg[i].venue_genre.toLowerCase() ==
          searchTerm.toLowerCase() && this.venuarrOrg[i].availability.toLowerCase() ==
          this.selectedCrowdCat.toLowerCase()
        ) {
          this.venuarr.push(this.venuarrOrg[i]);
        }
      }else{
        if (
          this.venuarrOrg[i].venue_genre.toLowerCase() ==
          searchTerm.toLowerCase()
        ) {
          this.venuarr.push(this.venuarrOrg[i]);
        }
      }
      
    }

    var newVenuArr = [];
    for (var i = 0; i < this.venuarr.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.venuarr[i].lattitude),
          lng: parseFloat(this.venuarr[i].longitude),
        },
        title: "" + this.venuarr[i].availability_count,
        name: this.venuarr[i].name,
        venueId: this.venuarr[i].venues_id,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };
      newVenuArr.push(obj);
    }

    this.venuarr = [];
    this.venuarr = newVenuArr;
    this.markers = this.venuarr;
    console.log('results: ',this.markers);
    
  }

  searchAndFilterEventItems(searchTerm: any) {
    this.eventarr = [];
    for (var i = 0; i < this.eventArrOrg.length; i++) {
      if (
        this.eventArrOrg[i].events_genre.toLowerCase() ==
        searchTerm.toLowerCase()
      ) {
        this.eventarr.push(this.eventArrOrg[i]);
      }
    }

    var newEventArr = [];
    for (var i = 0; i < this.eventarr.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.eventarr[i].lattitude),
          lng: parseFloat(this.eventarr[i].longitude),
        },
        title: "" + this.eventarr[i].availability_count,
        name: this.eventarr[i].name,
        eventId: this.eventarr[i].events_id,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };
      newEventArr.push(obj);
    }

    this.eventarr = [];
    this.eventarr = newEventArr;
    this.markers = this.eventarr;
    console.log('results: ',this.markers);
    
  }

  getTime(val:any){
    return val.substring(0,5);
  }

  makeMarkerArray() {
    this.venuarr = [];
    console.log("Venuarr ORG: ",this.venuarrOrg);
    
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.venuarrOrg[i].lattitude),
          lng: parseFloat(this.venuarrOrg[i].longitude),
        },
        title: "" + this.venuarrOrg[i].availability_count,
        name: this.venuarrOrg[i].name,
        venueId:this.venuarrOrg[i].venues_id,
        
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };

      this.venuarr.push(obj);
    }

    this.markers = this.venuarr;
    console.log("Venuarr : ",this.venuarr);
    console.log("markersArr : ",this.markers);
  }

  makeEventMarkerArray() {
    this.eventarr = [];
    console.log("Eventarr ORG: ",this.eventArrOrg);
    
    for (var i = 0; i < this.eventArrOrg.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.eventArrOrg[i].lattitude),
          lng: parseFloat(this.eventArrOrg[i].longitude),
        },
        title: "" + this.eventArrOrg[i].availability_count,
        name: this.eventArrOrg[i].name,
        eventId:this.eventArrOrg[i].events_id,
        
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };

      this.eventarr.push(obj);
    }
    // this.eventMarkers = this.eventarr;
    
    for (let index = 0; index < this.eventarr.length; index++) {
      this.markers.push(this.eventarr[index]);
    }
    // let mark = [];
    // mark.
    console.log("EventArr : ",this.eventarr);
    console.log("markersArr : ",this.markers);
    this.allVenueEventMarkers = this.markers;
  }

  getCurrentLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
         this.currentLatitude = pos.lat;
         this.currentLongitude = pos.lng;
          
          this.center = pos;
          this.userLocation = {
            position: {
              lat: pos.lat,
              lng: pos.lng,
            },
           
            options: {
              animation: google.maps.Animation.DROP,
              draggable: false,
              icon: {
                url: "../../assets/imgs/icons/loc_pin_new.svg",
                
              },
            },
          };
        },
        () => {
          // handleLocationError(true, infoWindow, map.getCenter()!);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      // handleLocationError(false, infoWindow, map.getCenter()!);
    }
    
    this.showCategories = false;
    this.showCrowdfilters = false;
    this.showEventCategories = false;
    this.map.googleMap?.setZoom(13);
  }

  setMarkersAgain(){
    this.directionsResults$ =of<google.maps.DirectionsResult | undefined>(undefined);
    this.showDetail = false;
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.venuarr = [];
    // this.markers = [];
    console.log("Venuarr ORG: ",this.venuarrOrg);
    
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.venuarrOrg[i].lattitude),
          lng: parseFloat(this.venuarrOrg[i].longitude),
        },
        title: "" + this.venuarrOrg[i].availability_count,
        name: this.venuarrOrg[i].name,
        venueId: this.venuarrOrg[i].venues_id,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };

      this.venuarr.push(obj);
    }

    this.markers = this.venuarr;
    console.log("Venuarr : ",this.venuarr);
    console.log("markersArr : ",this.markers);
    this.showCategories = false;
  }

  setEventMarkersAgain(){
    this.directionsResults$ =of<google.maps.DirectionsResult | undefined>(undefined);
    this.showEventDetail = false;
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.eventarr = [];
    // this.markers = [];
    console.log("EventArr ORG: ",this.eventArrOrg);
    
    for (var i = 0; i < this.eventArrOrg.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.eventArrOrg[i].lattitude),
          lng: parseFloat(this.eventArrOrg[i].longitude),
        },
        title: "" + this.eventArrOrg[i].availability_count,
        name: this.eventArrOrg[i].name,
        eventId: this.eventArrOrg[i].events_id,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin2.svg",
            size: {
              height: 48,
              width: 48,
            },
          },
        },
      };

      this.eventarr.push(obj);
    }

    this.markers = this.eventarr;
    console.log("EventArr : ",this.eventarr);
    console.log("markersArr : ",this.markers);
    this.showEventCategories = false;
  }

  async HideFilter() {
    this.searchObject = "";
    this.searchEventObject = "";
    this.showCrowdfilters = false;
  }

  gotodetail() {
    this.rest.detail = this.searchObject;
    this.HideFilter();
    this.router.navigate(["venuedetail"]);
  }

  gotoEventdetail() {
    this.rest.detail = this.searchEventObject;
    this.HideFilter();
    this.router.navigate(["eventdetail"]);
  }

  ngAfterViewInit(): void {}

  async ngOnInit() {

    Keyboard.addListener('keyboardWillShow', () => {
      console.log('keyboard will show');
      SpeechRecognition.stop();
      this.inputFeatureActive = true;
      this.keyboardIsVisible = true;
      this.listening = false;
      console.log("keyboardIsVisible: ",this.keyboardIsVisible);
      console.log("listening: ",this.listening);
      this.changeDetectorRef.detectChanges();
      
    });

    Keyboard.addListener('keyboardWillHide', () => {
      console.log('keyboard will hide');
      this.keyboardIsVisible = false;
      console.log("keyboardIsVisible: ",this.keyboardIsVisible);
      if(this.typedText == ''){
        this.inputFeatureActive = false;
      }
      console.log('input feature active: ',this.inputFeatureActive);

      this.changeDetectorRef.detectChanges();
      
      console.log(this.inputFeatureActive);
      if(this.typedText != '' ){
        console.log('back button pressed 2');
        this.venuarr = this.venuarrOrg;
        this.dismissModal();
        this.findResults(this.typedText);
      }
      
    });
  }

  // setMarkerPosition(latitude: any, longitude: any) {
  //   console.log("marker position");

  //   this.venuarr = [];
  //   for (var i = 0; i < this.venuarrOrg.length; i++) {
  //     var obj = {
  //       position: {
  //         lat: parseFloat(this.venuarrOrg[i].lattitude),
  //         lng: parseFloat(this.venuarrOrg[i].longitude),
  //       },
  //       title: "" + this.venuarrOrg[i].availability_count,
  //       name: this.venuarrOrg[i].name,
  //       icon: {
  //         url: "assets/imgs/locpin.svg",
  //         size: {
  //           height: 120,
  //           width: 30,
  //         },
  //       },
  //       options: {
  //         animation: google.maps.Animation.DROP,
  //         draggable: false,
  //         icon: {
  //           url: "assets/imgs/locpin.svg",
  //           size: {
  //             height: 120,
  //             width: 30,
  //           },
  //         },
  //       },
  //     };

  //     this.venuarr.push(obj);
  //   }

  //   this.markers = this.venuarr;
  // }

  eventHandler(event: any, name: string) {
    console.log("event123", event);

    switch (name) {
      case "mapDblclick": // Add marker on double click event
        break;

      case "mapDragMarker":
        break;

      case "mapDragend":
        this.getAddress(event.latLng.lat(), event.latLng.lng());
        break;

      default:
        break;
    }
  }           

  getAddress(latitude: any, longitude: any) {
    this.geoCoder
      .geocode({ location: { lat: latitude, lng: longitude } })
      .subscribe((addr: MapGeocoderResponse) => {
        console.log("MapGeocoderResponse addr: ",addr);
        
        if (addr.status === "OK") {
          if (addr.results[0]) {
            this.zoom = 13;
            this.address = addr.results[0].formatted_address;
          } else {
            this.address = "";
            window.alert("No results found");
          }
        } else {
          this.address = "";
          window.alert("Geocoder failed due to: " + addr.status);
        }
      });
  }

  closeWindow(){
    this.infoWindow.close();
  }

  @ViewChild(MapInfoWindow, { static: false })
  infoWindow!: MapInfoWindow;

  infoContent: string | undefined;

  openInfo(marker: MapMarker | undefined, content: string, markerobj: any) {
  
    this.infoContent = content;
    if(marker){
      this.infoWindow.open(marker);
    }
    console.log("Map Marker:",marker);
    
    console.log("markerobj-----------", markerobj);
    console.log("content title-----------", content);
    if(markerobj.venueId){
      this.searchEventObject = '';
      this.filterArrypin(markerobj.venueId);
    }else{
      this.searchObject = '';
      this.filterEventArrypin(markerobj.eventId);
    }
  }

  async filterArrypin(searchTerm: any) {
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      // if (this.venuarrOrg[i].name.toLowerCase() == searchTerm.toLowerCase()) {
      if (this.venuarrOrg[i].venues_id == searchTerm) {
        this.searchObject = this.venuarrOrg[i];
        let dayNumber = getDay(new Date());
        console.log(dayNumber);
        if(this.searchObject.venue_timing[dayNumber].start_hours != null && this.searchObject.venue_timing[dayNumber].close_hours != null){
      
          this.searchObject.start_hours = this.searchObject.venue_timing[dayNumber].start_hours;
          this.searchObject.close_hours = this.searchObject.venue_timing[dayNumber].close_hours;

          // parsed time
          this.searchObject.start_hours = parse(this.searchObject.start_hours, 'HH:mm:ss', new Date());
          this.searchObject.close_hours = parse(this.searchObject.close_hours, 'HH:mm:ss', new Date());
          //formated time
          this.searchObject.start_hours = format(this.searchObject.start_hours, 'h:mma');
          this.searchObject.close_hours = format(this.searchObject.close_hours, 'h:mma');
        }else{
          this.searchObject.start_hours = null;
          this.searchObject.close_hours = null;
        }

      }
    }
    console.log("this.searchObject: ",this.searchObject);
    this.showDetail = true;
    this.rest.pinobject = this.searchObject;
    // this.getDirections();
    this.showCategories = false;
    this.showCrowdfilters = false;
    // this.goTOinfopage();
  }
  async filterEventArrypin(searchTerm: any) {
    for (var i = 0; i < this.eventArrOrg.length; i++) {
      // if (this.venuarrOrg[i].name.toLowerCase() == searchTerm.toLowerCase()) {
      if (this.eventArrOrg[i].events_id == searchTerm) {
        this.searchEventObject = this.eventArrOrg[i];
        // let dayNumber = getDay(new Date());
        // console.log(dayNumber);
        // if(this.searchObject.venue_timing[dayNumber].start_hours != null && this.searchObject.venue_timing[dayNumber].close_hours != null){
      
          // this.searchObject.start_hours = this.searchObject.venue_timing[dayNumber].start_hours;
          // this.searchObject.close_hours = this.searchObject.venue_timing[dayNumber].close_hours;

          // parsed time
          // this.searchObject.start_hours = parse(this.searchObject.start_hours, 'HH:mm:ss', new Date());
          // this.searchObject.close_hours = parse(this.searchObject.close_hours, 'HH:mm:ss', new Date());
          this.searchEventObject.formatted_start_time = parse(this.searchEventObject.event_start_time, 'HH:mm:ss', new Date());
          this.searchEventObject.formatted_end_time = parse(this.searchEventObject.event_end_time, 'HH:mm:ss', new Date());
          //formated time
          this.searchEventObject.formatted_start_time = format(this.searchEventObject.formatted_start_time, 'h:mma');
          this.searchEventObject.formatted_end_time = format(this.searchEventObject.formatted_end_time, 'h:mma');
        // }
        // else{
          // this.searchObject.start_hours = null;
          // this.searchObject.close_hours = null;
        // }

      }
    }
    console.log("this.searchObject event: ",this.searchEventObject);
    this.showEventDetail = true;
    this.rest.pinobject = this.searchEventObject;
    // this.getDirections();
    this.showEventCategories = false;
    this.showCrowdfilters = false;
    // this.goTOinfopage();
  }

  likevenu() {
    console.log("likevenu", this.searchObject);

    if (this.searchObject.likes == 0) {
      this.searchObject.likes = 1;
      this.likeDislikeUServenu(this.searchObject.venues_id);
    }
  }
  likeoutvenu() {
    console.log("likeoutvenu", this.searchObject);

    if (this.searchObject.likes == 1) {
      this.searchObject.likes = 0;
      this.likeDislikeUServenu(this.searchObject.venues_id);
    }
  }

  likeDislikeUServenu(venues_id: any) {
    console.log(venues_id);
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: venues_id,
    });

    console.log(ss);
    this.rest.venues_like_unlike(ss).subscribe((res: any) => {
      console.log(res);
    });
  }

  likeevent() {
    console.log("likeEvent", this.searchEventObject);

    if (this.searchEventObject.likes == 0) {
      this.searchEventObject.likes = 1;
      this.likeDislikeUSerEvents(this.searchEventObject.events_id);
    }
  }

  likeoutevent() {
    console.log("likeoutevent", this.searchEventObject);

    if (this.searchEventObject.likes == 1) {
      this.searchEventObject.likes = 0;
      this.likeDislikeUSerEvents(this.searchEventObject.events_id);
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
}
