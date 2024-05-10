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
import { format, getDay, isEqual, parse } from "date-fns";
// import  { Screenshot } from 'capacitor-screenshot';
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

  //// angular map
  showfilter = false;

  currentLatitude:any;
  currentLongitude:any;

  title = "Title here";
  venuarr: any = "";
  venuarrOrg: any = "";

  filtertype = "no";
  showSideElements = true;
  searchObject: any = "";
  markerscheck = [];

  dbLati: any = "";
  dbLong: any = "";

  a: any = "";
  b: any = "";
  ss: any;
  userLocation:any;
  directionsResults$!: Observable<google.maps.DirectionsResult | undefined>;
  showCategories = false;
  showDetail = false;
  yourVoiceInput = '';
  listener: boolean = false;
  ai = '';
  aiToggleChecked: boolean = false;
  venueKeywords: any = [];
  dayTimeKeywords:string[] = ['until','till','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00', '1','2','3','4','5','6','7','8','9','10','11','12', 'a.m.', 'p.m.', 'tonight'];
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

  async startSpeechRecognition(){
    
    if(this.listener){
      console.log(this.listener);
      
      this.listener = false;
      SpeechRecognition.stop();
    }

    this.venuarr = this.venuarrOrg;

    this.yourVoiceInput = '';
    console.log('startSpeechRecognition');
    
    const {available} = await SpeechRecognition.available();
    console.log('availability res: ',available);

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
      }).then((res: any) => {
        // console.log('fall in then case for partial results');
      });

    }
  }

  async stopSpeechRecognition(){
    console.log('stopSpeechRecognition');
    
    if(this.listener){
      console.log(this.listener);
      
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
    
    this.findVenueAndDiscount(tokens);
    
  }

  findVenueAndDiscount = (inputTokens:string[]) => {
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
    console.log("filteredVenues: ",filteredVenues); 
    this.venuarr = filteredVenues;

    this.setMarkersForFoundVenues(filteredVenues);
    
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
        title: "" + foundVenues[i].public_check_ins,
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

  dismissModal(){
    console.log('stopSpeechRecognition');
    
    if(this.listener){
      console.log(this.listener);
      
      this.listener = false;
      SpeechRecognition.stop();
    }
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
      title: "" + this.foundVenue.public_check_ins,
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
    console.log("this.venuarrOrg",this.venuarrOrg.length);
    this.makeMarkerArray();
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
    this.getVenueAIKeywords();
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
              title: "" + this.venuarrOrg[i].public_check_ins,
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
    this.setMarkersAgain();
    // console.log("this.venuarr",this.venuarr);
    
    // var newVenuArr = [];
    // for (var i = 0; i < this.venuarr.length; i++) {
    //   var obj = {
    //     position: {
    //       lat: parseFloat(this.venuarr[i].lattitude),
    //       lng: parseFloat(this.venuarr[i].longitude),
    //     },
    //     title: "" + this.venuarr[i].public_check_ins,
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

  showHideFilter(item: any) {
    this.directionsResults$ = of<google.maps.DirectionsResult | undefined>(undefined);
    this.showDetail = false;
    this.map.googleMap?.setZoom(13);
    this.center = {
      lat: this.currentLatitude,
      lng: this.currentLongitude,
    };
    this.searchAndFilterItems(item);

    this.filtertype = item;

    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }
  }

  async showHideFilterN() {
    
    this.showfilter = !this.showfilter;
    this.showCategories = false;

   
  }

  toggleCategories(){
    // this.searchObject = "";
    this.showCategories = !this.showCategories;
    this.showfilter = false;
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

    var newVenuArr = [];
    for (var i = 0; i < this.venuarr.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.venuarr[i].lattitude),
          lng: parseFloat(this.venuarr[i].longitude),
        },
        title: "" + this.venuarr[i].public_check_ins,
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
        title: "" + this.venuarrOrg[i].public_check_ins,
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
                url: "../../assets/imgs/icons/location_28.svg",
                
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
    this.showfilter = false;
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
        title: "" + this.venuarrOrg[i].public_check_ins,
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

  async HideFilter() {
    this.searchObject = "";
    this.showfilter = false;
   
  }

  // async goTOinfopage() {
  //   this.HideFilter();

  //   const modal = await this.modalCtrl.create({
  //     component: PininfoPage,
  //     cssClass: "pinModal",
  //   });
  //   await modal.present();

  //   this.modalopen = 1;
  // }

  gotodetail() {
    this.rest.detail = this.searchObject;
    this.HideFilter();
    this.router.navigate(["venuedetail"]);
  }

  ngAfterViewInit(): void {}

  async ngOnInit() {
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
  //       title: "" + this.venuarrOrg[i].public_check_ins,
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

    this.filterArrypin(markerobj.venueId);
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
    this.getDirections();
    this.showCategories = false;
    this.showfilter = false;
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
}
