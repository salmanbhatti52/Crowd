import { FilterPage } from "./../filter/filter.page";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { IonContent, IonInput, ModalController } from "@ionic/angular";

import { RestService } from "../rest.service";
import { SelectVenuePopupPage } from "../select-venue-popup/select-venue-popup.page";
import { Geolocation } from "@capacitor/geolocation";
import { Observable, find } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { MapGeocoder } from "@angular/google-maps";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { eachMinuteOfInterval, format, getDay, isEqual, parse, parseISO } from "date-fns";
import { Platform } from "@ionic/angular";
import { AnimationOptions } from 'ngx-lottie';
import { Keyboard } from "@capacitor/keyboard";
import { LocationService } from "../location.service";
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  @ViewChild('welcomeMessage', { static: false })
  welcomeMessage!: ElementRef;
  // @ViewChild('lottie', { static: true }) lottie: LottieAnimationView;
  // animationItem: AnimationItem;
  // @ViewChild("IonContent", { static: true })
  // @ViewChild('hiddenInput',{static:true}) hiddenInput!:ElementRef
  // content!: IonContent;
  // @ViewChild('hiddenInput', { static: true }) hiddenInput!: ElementRef;
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  segmentModel = "venu";
  showfilter = false;
  venuarr: any = [];
  reservationsArr: any = [];
  filteredReservationsArr: any = [];
  venusNearUserLoc: any = [];
  venuarrOrg: any = "";
  number = "123";
  eventarr: any = [];
  filtertype: any = "no";
  reservationFilter: any = "no";
  filterTypeEv: any = "no";
  showWeather = false;
  reservationFeature: any = '';
  // venusArray:any = []
  noevent = 0;
  noevenu = 0;
  noReservations = 0;

  pageNumber = 1;
  latitude: any;
  longitude: any;
  venueList: any;
  selectedVenue = {};
  selectedVenueName = "";
  timeInMinutes = 0;

  filteredvenuarr: any = "";
  eventsArrayCopy: any;
  venuesFromGoogle: any = [];
  radius: any;
  placeType: any;
  claimedVenues: any = [];
  yourVoiceInput = '';
  listener: boolean = false;
  listeningStatus: string = '';
  listening: boolean = false;
  ai = "";
  aiToggleChecked: boolean = false;
  isAnimating = false;
  timeout: any;
  inactivityDelay = 5000;
  // deniedVoicePermissionCount = 0;
  toggleThemeChecked = true;
  typedText: any = '';
  currentLat: any;
  currentLong: any;
  firstTimeLat: any = undefined;
  firstTimeLong: any = undefined;

  intervalId: any;
  venueKeywords: any = [];
  eventKeywords: any = [];
  dayTimeKeywords: string[] = ['until', 'till', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'a.m.', 'p.m.', 'tonight'];
  isAIModalOpen = false;
  // gettingInput = false;
  radiusInMeters = 10; // 10 meters

  inputFeatureActive = false;
  // lottieConfig!: AnimationOptions;
  keyboardIsVisible = false;
  constructor(
    public router: Router,
    public rest: RestService,
    public modalCtrlr: ModalController,
    private http: HttpClient,
    private geoCoder: MapGeocoder,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform,
    private renderer: Renderer2,
    public locationService: LocationService
  ) {
    if (!this.platform.is("mobileweb")) {
      console.log('Requesting permissions');

    }
    // this.rest.sendNotification().subscribe((res:any)=>{
    //   console.log('send Notification Res: ',res);

    // });
    // this.lottieConfig = {
    //   path: 'assets/animation.json', // Path to your Lottie animation file
    //   renderer: 'svg', // 'svg', 'canvas', 'html'
    //   autoplay: true,
    //   loop: true,
    // };



  }

  closeNewModel() {
    this.showWeather = false;
    this.changeDetectorRef.detectChanges();
    this.router.navigate(['weather-detail']);
  }

  showWeatherFunc() {
    this.showWeather = true;
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
    this.typeWriter();
  }

  setOpenValueForAI(isOpen: boolean) {
    this.isAIModalOpen = isOpen;
    this.typedText = '';
    // setTimeout(() => this.typeWriter(), 2000);


  }

  toggleTheme(ev: any) {
    // this.typedText = '';
    console.log(ev);

    this.toggleThemeChecked = !this.toggleThemeChecked;
    console.log(this.toggleThemeChecked);

  }

  showKeyboard() {
    // console.log('show keyboard called, stop speech recognition');
    // this.listening = false;
    // SpeechRecognition.stop();
    // this.clearInactivityTimeout();
  }

  onInputForAI(ev: any) {
    console.log("input event triggered", ev);

    this.typedText = ev.target.value;
    console.log(this.typedText);

  }

  searchForAIInput(ev: any) {

    // console.log('ion Blur input',ev);
    // console.log('this.typedText: ',this.typedText);

    // if(this.typedText != ''){
    //   this.dismissModal();
    //   this.findResults(this.typedText);
    // }

  }

  getVenueAIKeywords() {
    let data = {
      "customer_id": this.userID
    }
    this.rest.sendRequest('venues_keywords', data).subscribe((res: any) => {
      // console.log("venue_keywords are", res);
      if (res.status == 'success') {
        let venueKeywordsObj: any = {};
        venueKeywordsObj.budget = res.data[0].Budget;
        venueKeywordsObj.cuisine = res.data[0].Cuisine;
        venueKeywordsObj.food = res.data[0].Food;
        venueKeywordsObj.music = res.data[0].Music;
        venueKeywordsObj.types = res.data[0].Types;
        venueKeywordsObj.payments = ['cash', 'card'];
        venueKeywordsObj.checks = ['near me', 'in my area', 'quite', 'quiet', 'busy', 'very busy'];
        // 9:00 p.m. 12:00 p.m.
        // venueKeywordsObj.state = ['quite','quiet','busy','very busy'];

        for (let i = 0; i < venueKeywordsObj.budget.length; i++) {
          venueKeywordsObj.budget[i] = venueKeywordsObj.budget[i].budget_range;
          //  venueKeywordsObj.budget[i] = venueKeywordsObj.budget[i].split(/\s+/)[0];
        }
        for (let i = 0; i < venueKeywordsObj.cuisine.length; i++) {
          venueKeywordsObj.cuisine[i] = venueKeywordsObj.cuisine[i].cusine;
        }
        for (let i = 0; i < venueKeywordsObj.types.length; i++) {
          venueKeywordsObj.types[i] = venueKeywordsObj.types[i].venues_type_name;
        }
        for (let i = 0; i < venueKeywordsObj.music.length; i++) {
          venueKeywordsObj.music[i] = venueKeywordsObj.music[i].music_type;
          // venueKeywordsObj.music[i] = venueKeywordsObj.music[i].split(/\s+/)[0];
        }

        for (let i = 0; i < venueKeywordsObj.food.length; i++) {
          venueKeywordsObj.food[i] = venueKeywordsObj.food[i].food_type;
        }
        // console.log(venueKeywordsObj);
        this.venueKeywords = [...venueKeywordsObj.budget, ...venueKeywordsObj.cuisine, ...venueKeywordsObj.types, ...venueKeywordsObj.music, ...venueKeywordsObj.food, ...venueKeywordsObj.payments, ...venueKeywordsObj.checks, ...this.dayTimeKeywords];

        console.log('Venue Keywords:', this.venueKeywords);
        // this.findWords();
      }
    });
  }

  getEventAIKeywords() {
    let data = {
      "customer_id": this.userID
    }
    this.rest.sendRequest('event_keywords', data).subscribe((res: any) => {
      console.log("Event_keywords are", res);
      if (res.status == 'success') {
        let eventKeywordsObj: any = {};

        eventKeywordsObj.music = res.data[0].Event_Music;
        eventKeywordsObj.types = res.data[0].Event_Exp;
        eventKeywordsObj.negations = ['non', 'do not include'];
        eventKeywordsObj.checks = ['near me', 'around me', 'in my area'];
        // 9:00 p.m. 12:00 p.m.



        for (let i = 0; i < eventKeywordsObj.types.length; i++) {
          eventKeywordsObj.types[i] = eventKeywordsObj.types[i].event_type;
        }
        for (let i = 0; i < eventKeywordsObj.music.length; i++) {
          eventKeywordsObj.music[i] = eventKeywordsObj.music[i].event_music;
          // venueKeywordsObj.music[i] = venueKeywordsObj.music[i].split(/\s+/)[0];
        }


        // console.log(eventKeywordsObj);
        this.eventKeywords = [...eventKeywordsObj.negations, ...eventKeywordsObj.types, ...eventKeywordsObj.music, ...eventKeywordsObj.checks, ...this.dayTimeKeywords];

        console.log('Event Keywords:', this.eventKeywords);

      }
    });
  }

  ngOnInit() {
    this.segmentModel = 'venu';
    if (this.platform.is('capacitor')) {
      console.log('plaform is capacitor based');

      Keyboard.addListener('keyboardWillShow', () => {
        console.log('keyboard will show');
        SpeechRecognition.stop();
        this.inputFeatureActive = true;
        this.keyboardIsVisible = true;
        this.listening = false;
        console.log("keyboardIsVisible: ", this.keyboardIsVisible);
        console.log("listening: ", this.listening);
        this.changeDetectorRef.detectChanges();
      });

      Keyboard.addListener('keyboardWillHide', () => {
        console.log('keyboard will hide');
        this.keyboardIsVisible = false;
        console.log("keyboardIsVisible: ", this.keyboardIsVisible);

        if (this.typedText == '') {
          this.inputFeatureActive = false;
        }
        console.log('input feature active: ', this.inputFeatureActive);

        this.changeDetectorRef.detectChanges();

        if (this.typedText != '') {
          console.log('back button pressed 2');

          if (this.segmentModel == "venu") {
            this.venuarr = this.venuarrOrg;
            this.filtertype = "no";
            this.noevenu = 0;
          }
          else if (this.segmentModel == "reservation" && this.reservationFeature == 'On') {
            this.filteredReservationsArr = this.reservationsArr;
            this.reservationFilter = "no";
            this.noReservations = 0;
          }
          else if (this.segmentModel == 'event') {
            this.eventarr = this.eventsArrayCopy;
            this.filterTypeEv = "no";
            this.noevent = 0;
          } else {

          }

          this.dismissModal();
          this.findResults(this.typedText);

        }

      });
    }

  }



  ionViewWillLeave() {
    // clearInterval(this.intervalId);
    this.clearInactivityTimeout();
  }

  // alwaysSendCurrentLocation() {
  //   this.intervalId = setInterval(()=>{
  //     this.alwaysGetCurrentPosition();
  //   }, 300000);
  // }

  // async alwaysGetCurrentPosition() {

  //   const getCurrentLocation = await Geolocation.getCurrentPosition({
  //     // enableHighAccuracy: true,

  //   });

  //   console.log("Current Location: ", getCurrentLocation);
  //   this.currentLat = getCurrentLocation.coords.latitude;
  //   this.currentLong = getCurrentLocation.coords.longitude;

  //   if(this.firstTimeLat == undefined && this.firstTimeLong == undefined){
  //     this.firstTimeLat = this.currentLat;
  //     this.firstTimeLong = this.currentLong;
  //   }else{
  //     const isWithinRadius = this.locationService.isWithinRadius(this.firstTimeLat,this.firstTimeLong,this.currentLat,this.currentLong,this.radiusInMeters);
  //     if(isWithinRadius){
  //       console.log('user location not changed, user in inside the venue');
  //     }else{
  //       this.timeInMinutes = 0;
  //       this.firstTimeLat = this.currentLat;
  //       this.firstTimeLong = this.currentLong;
  //     }
  //   }

  //   console.log("getCurrentPositionCalled");

  //   console.log("currentLat: ", this.currentLat);
  //   console.log("currentLong: ", this.currentLong);

  //   let data = {
  //     customer_id:this.userID,  
  //     current_longitude:this.currentLong,
  //     current_latitude:this.currentLat,
  //     location_time: this.timeInMinutes,
  //   }

  //   console.log("Update Location Payloads: ",data);


  //   this.rest.sendRequest('updateLocation',data).subscribe((res:any)=>{
  //     console.log('send current location res: ',res);
  //   });

  //   this.timeInMinutes+=5;

  // }

  getClaimedVenues() {
    let data = {
      "users_customers_id": this.userID
    };
    this.rest.sendRequest('get_claimed_venues', data).subscribe((res: any) => {
      console.log("get_claimed_venues", res);
      if (res.status == 'success') {
        this.claimedVenues = res.data;
      }

    });
  }

  async requestPermissions(): Promise<string> {

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

  async startSpeechRecognition() {
    this.inputFeatureActive = true;
    // this.typedText = '';
    // this.listening = false;

    // SpeechRecognition.stop();
    // this.yourVoiceInput = '';

    let checkPermissionsStatus = (await SpeechRecognition.checkPermissions()).speechRecognition;
    console.log('checkPermissionsResult: ', checkPermissionsStatus);

    if (checkPermissionsStatus !== "granted") {
      if (!this.platform.is("mobileweb")) {
        console.log('Requesting permissions');

        let permissionStaus = await this.requestPermissions();
        console.log("PermissionStatus 2", permissionStaus);

        if (permissionStaus === 'granted') {
          checkPermissionsStatus = 'granted';
        }
        else {
          this.rest.deniedVoicePermissionCount++;
        }
      }
    }

    if (this.segmentModel == "venu") {
      this.venuarr = this.venuarrOrg;
      this.filtertype = "no";
      this.noevenu = 0;
    }
    else if (this.segmentModel == "reservation" && this.reservationFeature == 'On') {
      this.filteredReservationsArr = this.reservationsArr;
      this.reservationFilter = "no";
      this.noReservations = 0;
    }
    else if (this.segmentModel == 'event') {
      this.eventarr = this.eventsArrayCopy;
      this.filterTypeEv = "no";
      this.noevent = 0;
    } else {

    }


    const { available } = await SpeechRecognition.available();
    console.log('availability res: ', available);

    if (checkPermissionsStatus === 'granted' && available) {

      this.setInactivityTimeout();
      // ===========speech start try catch====================

      try {
        SpeechRecognition.start({
          language: "en-US",
          popup: false,
          partialResults: true,
        });
      } catch (error) {
        console.log("Speech Start error: ", error);
      }
      this.listening = true;
      this.changeDetectorRef.detectChanges();
      // ===========partial results try catch====================

      try {
        SpeechRecognition.addListener("partialResults", async (data: any) => {
          // console.log("partialResults was fired", data.matches);
          if (data.matches && data.matches.length > 0) {
            // if(this.listener == true){
            this.yourVoiceInput = data.matches[0];
            // this.gettingInput = true;
            this.changeDetectorRef.detectChanges();
            this.resetInactivityTimeout();
            // }
          }

        });
      } catch (error) {
        console.log('partial results error:', error);
      }

      // ===========listening state try catch====================

      try {
        SpeechRecognition.addListener('listeningState', (data: { status: "started" | "stopped" }) => {
          if (data.status == "started") {
            // this.gettingInput = true;
            // this.changeDetectorRef.detectChanges();
            this.listeningStatus = data.status;
            console.log("listening Status: ", this.listeningStatus);
            // this.listening = true;  
            // this.showAnimation();
          }
          else {
            //  this.gettingInput = false;
            //  this.changeDetectorRef.detectChanges();
            this.listeningStatus = data.status;
            console.log("listening Status: ", this.listeningStatus);
            // this.hideAnimation();
          }
        });
      } catch (error) {
        console.log("Listening state error: ", error);
        // this.gettingInput = false;
      }

      let result = SpeechRecognition.isListening();
      console.log("isListening: ", result);

    }
    else {
      if (this.rest.deniedVoicePermissionCount >= 2) {
        this.rest.presentToast('Voice recording denied; reinstall app to enable AI feature.');
      }
      this.dismissModal();
    }

  }

  setInactivityTimeout() {
    this.clearInactivityTimeout();
    this.timeout = setTimeout(() => {
      this.stopSpeechRecognition();
    }, this.inactivityDelay);
  }

  resetInactivityTimeout() {
    this.setInactivityTimeout();
  }

  clearInactivityTimeout() {
    if (this.timeout) {
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

  async stopSpeechRecognition() {

    SpeechRecognition.stop();

    this.listening = false;
    if (this.yourVoiceInput == '') {
      this.inputFeatureActive = false;
    }
    console.log('input feature active: ', this.inputFeatureActive);
    this.changeDetectorRef.detectChanges();

    this.clearInactivityTimeout();

    // this.yourVoiceInput = 'Pizza shopp having 30% off';
    if (this.yourVoiceInput != '') {
      this.dismissModal();
      this.findResults(this.yourVoiceInput);
    }
  }

  findResults(userInput: string) {
    this.typedText = '';
    this.yourVoiceInput = '';
    console.log('userInput: ', userInput);
    userInput = userInput.toLowerCase();
    let tokens = userInput.split(/\s+/);
    console.log(tokens);
    if (this.segmentModel == "venu") {
      this.findVenueAndDiscount(tokens);
    }
    else if (this.segmentModel == "reservation" && this.reservationFeature == 'On') {
      this.findReservationAndDiscount(tokens);
    }
    else if (this.segmentModel == 'event') {
      this.findEventAndDiscount(tokens);
    } else {

    }

  }

  findVenueAndDiscount = (inputTokens: string[]) => {
    this.noevenu = 0;
    let filteredVenues: any[] = [];

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

    let venueName: string = '';
    let venueNameTokens: string[] = [];
    let venueLocationName: string = '';
    let venueLocationNameTokens: string[] = [];
    let venueDiscount = '';
    let dayTimeTokens: string[] = [];
    let venueEndTime: string;


    let foundWords = this.findWords(inputTokens);
    console.log("foundWords for loop: ", foundWords);


    if (foundWords.length > 0) {
      findNearMe = foundWords.includes('near me');
      findAroundMe = foundWords.includes('around me');
      findInMyArea = foundWords.includes('in my area');
      dayTimeTokens = this.findCommonDayTimeTokens(foundWords);
      console.log('dayTimeTokens: ', dayTimeTokens);
      console.log('findNearMe: ', findNearMe);
      console.log('findInMyArea: ', findInMyArea);

      if (dayTimeTokens.length >= 3 && (dayTimeTokens.includes('till') || dayTimeTokens.includes('until')) &&
        (dayTimeTokens.includes('a.m.') || dayTimeTokens.includes('p.m.'))) {
        findDayTime = true;
      }


      if (foundWords.includes('busy')) {
        busyStatus = 'busy';
        findbusyStatus = true;
      } else if (foundWords.includes('very busy')) {
        busyStatus = 'very busy';
        findbusyStatus = true;
      } else if (foundWords.includes('quite') || foundWords.includes('quiet')) {
        busyStatus = 'quiet';
        findbusyStatus = true;
      } else { }
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


      if (foundWords.length == 0) {

        if (this.venuarr[venueIndex].discount_percentage != null) {
          venueDiscount = this.venuarr[venueIndex].discount_percentage.toString() + '%';
        } else {
          venueDiscount = '';
        }
        // console.log("venuDiscount: ",venuDiscount);

        venueName = this.venuarr[venueIndex].name.toLowerCase();
        venueNameTokens = venueName.split(/\s+/);

        // console.log(venuNameTokens);

        venueLocationName = this.venuarr[venueIndex].location.toLowerCase();
        venueLocationNameTokens = venueLocationName.split(/\s+/);
        // console.log(venueLocationNameTokens);
      } else if (foundWords.length > 0) {

        venueLocationName = this.venuarr[venueIndex].location.toLowerCase();
        venueLocationNameTokens = venueLocationName.split(/\s+/);
        // console.log(venueLocationNameTokens);

      } else { }

      // =========== finding required results from next line ===========================

      if (foundWords.length == 0) {
        foundVenueName = this.filterForAI(inputTokens, venueNameTokens);
        console.log('foundVenueName: ', foundVenueName);

        foundDiscount = this.filterForAI(inputTokens, venueDiscount.split(/\s+/));
        console.log('foundDiscount: ', foundDiscount);

        foundNamedLocation = this.filterForAI(inputTokens, venueLocationNameTokens);
        console.log('foundNamedLocation: ', foundNamedLocation);

      } else if (foundWords.length > 0) {

        foundNamedLocation = this.filterForAI(inputTokens, venueLocationNameTokens);
        console.log('foundNamedLocation: ', foundNamedLocation);

        // ---------------------looking for daytime match----------------------

        if (findDayTime) {
          // foundDayTime will be true for all events have matched time
          console.log('tonight not found');

          let dayNumber = getDay(new Date());
          if (this.venuarr[venueIndex].venue_timing[dayNumber].close_hours != null) {
            venueEndTime = this.venuarr[venueIndex].venue_timing[dayNumber].close_hours;
          } else {
            venueEndTime = '';
          }

          if (venueEndTime != '') {
            let requestedTime: string = '';

            if (dayTimeTokens[0] === 'until') {
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            } else if (dayTimeTokens[0] === 'till') {
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            }

            if (this.isVenueClosingTimeMatch(venueEndTime, requestedTime, dayTimeTokens)) {
              foundDayTime = true;
            } else {
              foundDayTime = false;
            }

          } else {
            foundDayTime = false;
            console.log('venueEndTime not found');

          }

          console.log('foundDayTime:', foundDayTime);

        }

        // -------------------------- till here --------------------------

      } else { }

      if (foundWords.length > 0) {
        // if(this.venuarr[venueIndex].venue_keywords.length > 0 && foundWords.length > 0){
        let venueKeywords = this.venuarr[venueIndex].venue_keywords
        foundSpecifiedChecks = this.filterVenuesForAIFeature(venueKeywords, foundWords);
        console.log("foundSpecifiedChecks: ", foundSpecifiedChecks);
        // } 

        if (findbusyStatus) {
          if (this.venuarr[venueIndex].availability.toLowerCase() == busyStatus) {
            foundbusyStatus = true;
            console.log('foundbusyStatus: ', foundbusyStatus);

          }
        }

        if (findNearMe) {
          if (Number.parseFloat(this.venuarr[venueIndex].distance) <= 1.0) {
            foundNearMe = true;
            console.log("foundNearMe: ", findNearMe);
          }
        }

        if (findAroundMe) {
          if (Number.parseFloat(this.venuarr[venueIndex].distance) <= 1.0) {
            foundAroundMe = true;
            console.log("findAroundMe: ", findAroundMe);
          }
        }
        // else
        if (findInMyArea) {
          if (Number.parseFloat(this.venuarr[venueIndex].distance) <= 2.1) {
            foundInMyArea = true;
            console.log("foundInMyArea: ", foundInMyArea);
          }
        }
        // else{}
      }



      // ==================== time to count found results=====================

      if (foundWords.length > 0) {

        if (findNearMe && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundNearMe && foundbusyStatus && foundDayTime) {
            console.log('adding venue by 1');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }

        else if (findAroundMe && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundAroundMe && foundbusyStatus && foundDayTime) {
            console.log('adding venue by 1');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }

        else if (findInMyArea && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundInMyArea && foundbusyStatus && foundDayTime) {
            console.log('adding venue by 2');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }

        else if (foundNamedLocation && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundbusyStatus && foundDayTime) {
            console.log('adding venue by 3');
            filteredVenues.push(this.venuarr[venueIndex]);
          }
        }

        else if (findNearMe && findbusyStatus && findDayTime) {
          if (foundNearMe && foundbusyStatus && foundDayTime) {
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 4');

        }

        else if (findAroundMe && findbusyStatus && findDayTime) {
          if (foundAroundMe && foundbusyStatus && foundDayTime) {
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 4');

        }

        else if (findInMyArea && findbusyStatus && findDayTime) {
          if (foundInMyArea && foundbusyStatus && foundDayTime) {
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 5');

        }

        else if (foundNamedLocation && findbusyStatus && findDayTime) {
          if (foundbusyStatus && foundDayTime) {
            filteredVenues.push(this.venuarr[venueIndex]);
          }
          console.log('adding venue by 6');

        }

        else if (foundSpecifiedChecks && findDayTime) {
          if (foundDayTime) {
            console.log('adding venue by 4');
            filteredVenues.push(this.venuarr[venueIndex]);
          } else {
            console.log('No matching criteria found 4');
          }
        }

        else if (findNearMe && foundSpecifiedChecks) {
          if (foundNearMe) {
            filteredVenues.push(this.venuarr[venueIndex]);
            console.log('adding venue by 7');
          }

        }

        else if (findAroundMe && foundSpecifiedChecks) {
          if (foundAroundMe) {
            filteredVenues.push(this.venuarr[venueIndex]);
            console.log('adding venue by 7');
          }

        }

        else if (findInMyArea && foundSpecifiedChecks) {
          if (foundInMyArea) {
            filteredVenues.push(this.venuarr[venueIndex]);
            console.log('adding venue by 8');
          }
        }

        else if (foundNamedLocation && foundSpecifiedChecks) {
          filteredVenues.push(this.venuarr[venueIndex]);
          console.log('adding venue by 8');

        }

        else if (findbusyStatus && foundSpecifiedChecks) {
          if (foundbusyStatus) {
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

        else if (foundSpecifiedChecks) {
          filteredVenues.push(this.venuarr[venueIndex]);
          console.log('adding venue by 10');

        }

        else {

        }

      } else if (foundWords.length == 0) {
        if (foundVenueName || foundDiscount || foundNamedLocation) {
          console.log("foundVenueName: ", foundVenueName);
          console.log("foundDiscount: ", foundDiscount);
          console.log('foundNamedLocation: ', foundNamedLocation);
          console.log('adding venue by 11');

          filteredVenues.push(this.venuarr[venueIndex]);
        }
      } else {

      }

    }

    this.filtertype = 'yes';
    console.log("filteredVenues: ", filteredVenues);
    this.venuarr = filteredVenues;

    if (filteredVenues.length == 0) {
      this.noevenu = 1;
    } else {
      this.noevenu = 0;
    }

  };

  findReservationAndDiscount = (inputTokens: string[]) => {
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


    let reservationName: string = '';
    let reservationNameTokens: string[] = [];
    let reservationLocationName: string = '';
    let reservationLocationNameTokens: string[] = [];
    let reservationDiscount = '';
    let dayTimeTokens: string[] = [];
    let venueEndTime: string;

    let foundWords = this.findWords(inputTokens);
    console.log("foundWords for loop: ", foundWords);


    if (foundWords.length > 0) {
      findNearMe = foundWords.includes('near me');
      findAroundMe = foundWords.includes('around me');
      findInMyArea = foundWords.includes('in my area');
      dayTimeTokens = this.findCommonDayTimeTokens(foundWords);
      console.log('dayTimeTokens: ', dayTimeTokens);
      console.log('findNearMe: ', findNearMe);
      console.log('findInMyArea: ', findInMyArea);

      if (dayTimeTokens.length >= 3 && (dayTimeTokens.includes('till') || dayTimeTokens.includes('until')) &&
        (dayTimeTokens.includes('a.m.') || dayTimeTokens.includes('p.m.'))) {
        findDayTime = true;
      }


      if (foundWords.includes('busy')) {
        busyStatus = 'busy';
        findbusyStatus = true;
      } else if (foundWords.includes('very busy')) {
        busyStatus = 'very busy';
        findbusyStatus = true;
      } else if (foundWords.includes('quite') || foundWords.includes('quiet')) {
        busyStatus = 'quiet';
        findbusyStatus = true;
      } else { }
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


      if (foundWords.length == 0) {

        if (this.filteredReservationsArr[reservationIndex].discount_percentage != null) {
          reservationDiscount = this.filteredReservationsArr[reservationIndex].discount_percentage.toString() + '%';
        }
        else {
          reservationDiscount = '';
        }

        // console.log("ReservationDiscount: ",reservationDiscount);

        reservationName = this.filteredReservationsArr[reservationIndex].name.toLowerCase();
        reservationNameTokens = reservationName.split(/\s+/);

        // console.log(reservationNameTokens);



        reservationLocationName = this.filteredReservationsArr[reservationIndex].location.toLowerCase();
        reservationLocationNameTokens = reservationLocationName.split(/\s+/);

        // console.log(reservationLocationNameTokens);

      } else if (foundWords.length > 0) {

        reservationLocationName = this.filteredReservationsArr[reservationIndex].location.toLowerCase();
        reservationLocationNameTokens = reservationLocationName.split(/\s+/);

        // console.log(reservationLocationNameTokens);

      } else { }

      // =========== finding required results from next line ===========================

      if (foundWords.length == 0) {
        foundReservationName = this.filterForAI(inputTokens, reservationNameTokens);
        console.log('foundReservationName: ', foundReservationName);

        foundDiscount = this.filterForAI(inputTokens, reservationDiscount.split(/\s+/));
        console.log('foundDiscount: ', foundDiscount);

        foundNamedLocation = this.filterForAI(inputTokens, reservationLocationNameTokens);
        console.log('foundNamedLocation: ', foundNamedLocation);

      } else if (foundWords.length > 0) {

        foundNamedLocation = this.filterForAI(inputTokens, reservationLocationNameTokens);
        console.log('foundNamedLocation: ', foundNamedLocation);

        // ---------------------looking for daytime match----------------------

        if (findDayTime) {
          // foundDayTime will be true for all events have matched time
          console.log('tonight not found');

          let dayNumber = getDay(new Date());
          if (this.filteredReservationsArr[reservationIndex].venue_timing[dayNumber].close_hours != null) {
            venueEndTime = this.filteredReservationsArr[reservationIndex].venue_timing[dayNumber].close_hours;
          } else {
            venueEndTime = '';
          }

          if (venueEndTime != '') {
            let requestedTime: string = '';

            if (dayTimeTokens[0] === 'until') {
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            } else if (dayTimeTokens[0] === 'till') {
              requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
            }

            if (this.isVenueClosingTimeMatch(venueEndTime, requestedTime, dayTimeTokens)) {
              foundDayTime = true;
            } else {
              foundDayTime = false;
            }

          } else {
            foundDayTime = false;
            console.log('venueEndTime not found');

          }

          console.log('foundDayTime:', foundDayTime);

        }

        // -------------------------- till here --------------------------

      } else { }

      if (foundWords.length > 0) {
        // if(this.filteredReservationsArr[reservationIndex].venue_keywords.length > 0 && foundWords.length > 0){
        let venueKeywords = this.filteredReservationsArr[reservationIndex].venue_keywords;
        foundSpecifiedChecks = this.filterVenuesForAIFeature(venueKeywords, foundWords);
        console.log("foundSpecifiedChecks: ", foundSpecifiedChecks);
        // } 

        if (findbusyStatus) {
          if (this.filteredReservationsArr[reservationIndex].availability.toLowerCase() == busyStatus) {
            foundbusyStatus = true;
            console.log('foundbusyStatus: ', foundbusyStatus);

          }
        }

        if (findNearMe) {
          if (Number.parseFloat(this.filteredReservationsArr[reservationIndex].distance) <= 1.0) {
            foundNearMe = true;
            console.log("foundNearMe: ", findNearMe);
          }
        }

        if (findAroundMe) {
          if (Number.parseFloat(this.filteredReservationsArr[reservationIndex].distance) <= 1.0) {
            foundAroundMe = true;
            console.log("findAroundMe: ", findAroundMe);
          }
        }
        // else
        if (findInMyArea) {
          if (Number.parseFloat(this.filteredReservationsArr[reservationIndex].distance) <= 2.1) {
            foundInMyArea = true;
            console.log("foundInMyArea: ", foundInMyArea);
          }
        }
        // else{}
      }



      // ==================== time to count found results=====================

      if (foundWords.length > 0) {

        if (findNearMe && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundNearMe && foundbusyStatus && foundDayTime) {
            console.log('adding venue by 1');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }

        else if (findAroundMe && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundAroundMe && foundbusyStatus && foundDayTime) {
            console.log('adding venue by 1');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }

        else if (findInMyArea && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundInMyArea && foundbusyStatus && foundDayTime) {
            console.log('adding venue by 2');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }

        else if (foundNamedLocation && findbusyStatus && foundSpecifiedChecks && findDayTime) {
          if (foundbusyStatus && foundDayTime) {
            console.log('adding venue by 3');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
        }

        else if (findNearMe && findbusyStatus && findDayTime) {
          if (foundNearMe && foundbusyStatus && foundDayTime) {
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 4');

        }

        else if (findAroundMe && findbusyStatus && findDayTime) {
          if (foundAroundMe && foundbusyStatus && foundDayTime) {
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 4');

        }

        else if (findInMyArea && findbusyStatus && findDayTime) {
          if (foundInMyArea && foundbusyStatus && foundDayTime) {
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 5');

        }

        else if (foundNamedLocation && findbusyStatus && findDayTime) {
          if (foundbusyStatus && foundDayTime) {
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          }
          console.log('adding venue by 6');

        }

        else if (foundSpecifiedChecks && findDayTime) {
          if (foundDayTime) {
            console.log('adding venue by 4');
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          } else {
            console.log('No matching criteria found 4');
          }
        }

        else if (findNearMe && foundSpecifiedChecks) {
          if (foundNearMe) {
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
            console.log('adding venue by 7');
          }

        }

        else if (findAroundMe && foundSpecifiedChecks) {
          if (foundAroundMe) {
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
            console.log('adding venue by 7');
          }

        }

        else if (findInMyArea && foundSpecifiedChecks) {
          if (foundInMyArea) {
            filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
            console.log('adding venue by 8');
          }
        }

        else if (foundNamedLocation && foundSpecifiedChecks) {
          filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          console.log('adding venue by 8');

        }

        else if (findbusyStatus && foundSpecifiedChecks) {
          if (foundbusyStatus) {
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

        else if (foundSpecifiedChecks) {
          filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
          console.log('adding venue by 10');

        }

        else {

        }

      } else if (foundWords.length == 0) {
        if (foundReservationName || foundDiscount || foundNamedLocation) {
          console.log("foundReservationNamee: ", foundReservationName);
          console.log("foundDiscount: ", foundDiscount);
          console.log('foundNamedLocation: ', foundNamedLocation);
          console.log('adding venue by 11');

          filteredReservations.push(this.filteredReservationsArr[reservationIndex]);
        }

      } else {

      }

    }


    this.reservationFilter = 'yes';
    console.log("filteredReservationes: ", filteredReservations);
    this.filteredReservationsArr = filteredReservations;

    if (filteredReservations.length == 0) {
      this.noReservations = 1;
    } else {
      this.noReservations = 0;
    }

  };

  findEventAndDiscount = (inputTokens: string[]) => {
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


    let eventName: string = '';
    let eventNameTokens: string[] = [];
    let eventLocationName: string = '';
    let eventLocationNameTokens: string[] = [];
    let eventDiscount = '';
    let dayTimeTokens: string[] = [];
    let eventEndTime: string;
    let eventDateStr: string;

    let foundWords = this.findWordsforEvents(inputTokens);
    console.log("foundWords for loop: ", foundWords);
    // let find

    if (foundWords.length > 0) {
      findNearMe = foundWords.includes('near me');
      findAroundMe = foundWords.includes('around me');
      findInMyArea = foundWords.includes('in my area');
      dayTimeTokens = this.findCommonDayTimeTokens(foundWords);
      console.log('dayTimeTokens: ', dayTimeTokens);
      console.log('findNearMe: ', findNearMe);
      console.log('findInMyArea: ', findInMyArea);

      if (dayTimeTokens.length >= 3 && (dayTimeTokens.includes('till') || dayTimeTokens.includes('until')) &&
        (dayTimeTokens.includes('a.m.') || dayTimeTokens.includes('p.m.'))) {
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


      if (foundWords.length == 0) {

        if (this.eventarr[eventIndex].discount_percentage != null) {
          eventDiscount = this.eventarr[eventIndex].discount_percentage.toString() + '%';
        } else {
          eventDiscount = '';
        }

        // console.log("eventDiscount: ",eventDiscount);

        eventName = this.eventarr[eventIndex].name.toLowerCase();
        eventNameTokens = eventName.split(/\s+/);

        // console.log(eventNameTokens);

        eventLocationName = this.eventarr[eventIndex].location.toLowerCase();
        eventLocationNameTokens = eventLocationName.split(/\s+/);
        // console.log(eventLocationNameTokens);
      } else if (foundWords.length > 0) {

        eventLocationName = this.eventarr[eventIndex].location.toLowerCase();
        eventLocationNameTokens = eventLocationName.split(/\s+/);
        // console.log(eventLocationNameTokens);



        // if(findDayTime){
        //   eventEndTime = this.eventarr[eventIndex].event_end_time;
        // }
        // if(findDayTime && dayTimeTokens.includes('tonight')){
        //   eventDateStr = this.eventarr[eventIndex].event_date;
        // }

      } else { }

      // =========== finding required results from next line ===========================

      if (foundWords.length == 0) {
        foundEventName = this.filterForAI(inputTokens, eventNameTokens);
        console.log('foundEventName: ', foundEventName);

        foundDiscount = this.filterForAI(inputTokens, eventDiscount.split(/\s+/));
        console.log('foundDiscount: ', foundDiscount);

        foundNamedLocation = this.filterForAI(inputTokens, eventLocationNameTokens);
        console.log('foundNamedLocation: ', foundNamedLocation);

      } else if (foundWords.length > 0) {

        foundNamedLocation = this.filterForAI(inputTokens, eventLocationNameTokens);
        console.log('foundNamedLocation: ', foundNamedLocation);

        // ---------------------looking for daytime match----------------------

        if (findDayTime && !dayTimeTokens.includes('tonight')) {
          // foundDayTime will be true for all events have matched time
          console.log('tonight not found');

          let requestedTime: string = '';
          eventEndTime = this.eventarr[eventIndex].event_end_time;

          if (dayTimeTokens[0] === 'until') {
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          } else if (dayTimeTokens[0] === 'till') {
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          }

          if (this.isVenueClosingTimeMatch(eventEndTime, requestedTime, dayTimeTokens)) {
            foundDayTime = true;
          } else {
            foundDayTime = false;
          }

          console.log('foundDayTime:', foundDayTime);


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

        if (findDayTime && dayTimeTokens.includes('tonight')) {
          // foundDayTime will be true for only events have matched time and today date  
          console.log('tonight found');

          let todayDate = new Date();
          eventDateStr = this.eventarr[eventIndex].event_date;
          const eventDate = parseISO(eventDateStr);

          const formattedTodayDate = format(todayDate, 'yyyy-MM-dd');
          const formattedEventDate = format(eventDate, 'yyyy-MM-dd');

          console.log('formattedTodayDate: ', formattedTodayDate);
          console.log('formattedEventDate: ', formattedEventDate);

          let requestedTime: string = '';
          eventEndTime = this.eventarr[eventIndex].event_end_time;

          if (dayTimeTokens[0] === 'until') {
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          } else if (dayTimeTokens[0] === 'till') {
            requestedTime = `${this.standardizeHour(dayTimeTokens[1])} ${dayTimeTokens[2]}`;
          }

          if (formattedTodayDate === formattedEventDate && this.isVenueClosingTimeMatch(eventEndTime, requestedTime, dayTimeTokens)) {
            foundDayTime = true;
          } else {
            foundDayTime = false;
          }

          console.log('foundDayTime:', foundDayTime);


        }

        // -------------------------- till here --------------------------

      } else { }

      if (foundWords.length > 0) {
        // if(this.eventarr[eventIndex].venue_keywords.length > 0 && foundWords.length > 0){
        let eventKeywords = this.eventarr[eventIndex].event_keywords
        foundSpecifiedChecks = this.filterEventsForAIFeature(eventKeywords, foundWords);
        console.log("foundSpecifiedChecks: ", foundSpecifiedChecks);
        // } 

        if (findNearMe) {
          if (Number.parseFloat(this.eventarr[eventIndex].distance) <= 1.0) {
            foundNearMe = true;
            console.log("foundNearMe: ", findNearMe);
          }
        }

        if (findAroundMe) {
          if (Number.parseFloat(this.eventarr[eventIndex].distance) <= 1.0) {
            foundAroundMe = true;
            console.log("findAroundMe: ", findAroundMe);
          }
        }
        // else
        if (findInMyArea) {
          if (Number.parseFloat(this.eventarr[eventIndex].distance) <= 2.1) {
            foundInMyArea = true;
            console.log("foundInMyArea: ", foundInMyArea);
          }
        }
        // else{}
      }



      // ==================== time to count found results=====================

      if (foundWords.length > 0) {

        if (findNearMe && foundSpecifiedChecks && findDayTime) {
          if (foundNearMe && foundDayTime) {
            console.log('adding venue by 1');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 1');
          }
        }

        else if (findAroundMe && foundSpecifiedChecks && findDayTime) {
          if (foundAroundMe && foundDayTime) {
            console.log('adding venue by 1.1');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 1.1');
          }
        }

        else if (findInMyArea && foundSpecifiedChecks && findDayTime) {
          if (foundInMyArea && foundDayTime) {
            console.log('adding venue by 2');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 2');
          }
        }

        else if (foundNamedLocation && foundSpecifiedChecks && findDayTime) {
          if (foundDayTime) {
            console.log('adding venue by 3');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 3');
          }
        }

        else if (foundSpecifiedChecks && findDayTime) {
          if (foundDayTime) {
            console.log('adding venue by 4');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 4');
          }
        }

        else if (findNearMe && foundSpecifiedChecks) {
          if (foundNearMe) {
            console.log('adding venue by 5');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 5');
          }
        }

        else if (findAroundMe && foundSpecifiedChecks) {
          if (foundAroundMe) {
            console.log('adding venue by 6');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 6');
          }
        }

        else if (findInMyArea && foundSpecifiedChecks) {
          if (foundInMyArea) {
            console.log('adding venue by 7');
            filteredEvents.push(this.eventarr[eventIndex]);
          } else {
            console.log('No matching criteria found 7');
          }

        }

        else if (foundNamedLocation && foundSpecifiedChecks) {
          console.log('adding venue by 3');
          filteredEvents.push(this.eventarr[eventIndex]);
        }

        else if (foundSpecifiedChecks) {
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

        else {

        }

      } else if (foundWords.length == 0) {
        if (foundEventName || foundDiscount || foundNamedLocation) {
          console.log("foundEventName: ", foundEventName);
          console.log("foundDiscount: ", foundDiscount);
          console.log('foundNamedLocation: ', foundNamedLocation);
          console.log('adding venue by 11');

          filteredEvents.push(this.eventarr[eventIndex]);
        }

      } else {

      }

    }

    this.filterTypeEv = 'yes';
    console.log("filteredEvents: ", filteredEvents);
    this.eventarr = filteredEvents;

    if (filteredEvents.length == 0) {
      this.noevent = 1;
    } else {
      this.noevent = 0;
    }

  };

  findWords(inputTokens: string[]) {
    let foundWords: string[] = [];
    // specialCaseTimeValue 1:00, 1:01, 1:02 ..... 11:58, 11:59, 12:00
    let specialTimeCase = false;
    let specialTimeValue = '';
    this.venueKeywords.forEach((keyword: string) => {
      const formattedVenuKeyword = keyword.toLowerCase().replace(/-/g, ' ').split(/\s+/);
      // console.log("formattedVenuKeyword: ",formattedVenuKeyword);
      let result = formattedVenuKeyword.every((key: string) => {
        let res = false;
        inputTokens.forEach((token: string) => {

          if (token == 'rnb' && key == 'r&b') {
            res = true;
          } else if (token.includes(':') && key.includes(':')) {
            console.log("token is", token);

            let splitToken = token.split(':');
            let splitKey = key.split(':');

            if (splitToken[0] === splitKey[0]) {
              console.log('splitToken:', splitToken);
              console.log('splitKey: ', splitKey);
              specialTimeCase = true;
              specialTimeValue = token;
              res = true;
            }

          }
          else {
            if (token === key) {
              res = true;
            } else if (this.stemWord(token) === key) {
              res = true;
            }

          }

        });
        return res;
      });
      // console.log(result);
      if (result) {
        if (specialTimeCase) {
          foundWords.push(specialTimeValue);
          specialTimeCase = false;
        } else {
          // console.log('Match found');
          foundWords.push(keyword);
        }
      }
    });
    // console.log(foundWords);
    return foundWords;

  }

  findWordsforEvents(inputTokens: string[]) {
    let foundWords: string[] = [];
    // specialCaseTimeValue 1:00, 1:01, 1:02 ..... 11:58, 11:59, 12:00
    let specialTimeCase = false;
    let specialTimeValue = '';
    this.eventKeywords.forEach((keyword: string) => {
      const formattedEventKeyword = keyword.toLowerCase().replace(/-/g, ' ').split(/\s+/);
      // console.log("formattedEventKeyword: ",formattedEventKeyword);
      let result = formattedEventKeyword.every((key: string) => {
        let res = false;
        inputTokens.forEach((token: string) => {

          if (token == 'rnb' && key == 'r&b') {
            res = true;
          }
          else if (token.includes(':') && key.includes(':')) {
            console.log("token is", token);

            let splitToken = token.split(':');
            let splitKey = key.split(':');

            if (splitToken[0] === splitKey[0]) {
              console.log('splitToken:', splitToken);
              console.log('splitKey: ', splitKey);
              specialTimeCase = true;
              specialTimeValue = token;
              res = true;
            }

          }
          else {
            if (token === key) {
              res = true;
            } else if (this.stemWord(token) === key) {
              res = true;
            }

          }

        });
        return res;
      });

      // console.log(result);
      if (result) {
        if (specialTimeCase) {
          foundWords.push(specialTimeValue);
          specialTimeCase = false;
        } else {
          // console.log('Match found');
          foundWords.push(keyword);
        }
      }
    });

    // console.log(foundWords);
    return foundWords;

  }

  stemWord(word: string) {
    if (word.endsWith('s')) {
      return word.slice(0, -1);
    }
    return word;
  }

  filterForAI(inputTokens: string[], targetTokens: string[]) {
    return targetTokens.some((token: any) => {
      if (token == '0%') {
        if (inputTokens.includes('0%') || inputTokens.includes('zero')) {
          return true;
        } else {
          return false;
        }
      } else {
        return inputTokens.includes(token);
      }

    });
  }

  filterVenuesForAIFeature(keywords: any[], queryParams: string[]) {
    let otherKeys = ['near me', 'in my area', 'until', 'till', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'a.m.', 'p.m.', 'quite', 'quiet', 'busy', 'very busy']
    return queryParams.every((param: string) => {
      const paramKey = param.toLowerCase().replace(/-/g, ' ').split(/\s+/);
      console.log('New param is: ', paramKey);

      let res = false;


      for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i].keyword_value;
        const keys = keyword.toLowerCase().replace(/-/g, ' ').split(/\s+/);
        res = paramKey.every((pk: any) => {
          if (keys.includes(pk)) {
            return true;
          } else if (!keys.includes(pk)) {
            if (otherKeys.includes(param) || param.includes(':')) {
              console.log('other keys');
              console.log(param);
              return true;
            } else {
              return false;
            }

          } else {
            return false;
          }

        });
        if (res) {
          console.log('Match found: ', res);
          console.log('word is: ', paramKey);
          console.log('key is: ', keys);

          break;
        }
      }

      if (!res) {
        console.log('Result for this parma is:', res);
        console.log('word is: ', paramKey);
      }

      return res;
    });
  }

  filterEventsForAIFeature(keywords: any[], queryParams: string[]) {
    let otherKeys = ['non', 'do not include', 'near me', 'around me', 'in my area', 'until', 'till', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'a.m.', 'p.m.', 'tonight'];
    let negationKeyIndex: number | undefined = undefined;
    return queryParams.every((param: string) => {
      const paramKey = param.toLowerCase().replace(/-/g, ' ').split(/\s+/);
      console.log('New param is: ', paramKey);
      console.log('negationKeyIndex: ', negationKeyIndex);

      let res = false;

      for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i].keyword_value;
        const keys = keyword.toLowerCase().replace(/-/g, ' ').split(/\s+/);


        res = paramKey.every((pk: any, index) => {
          if (keys.includes(pk) && negationKeyIndex === undefined) {
            // console.log('case 1');
            console.log('keys: ', keys);
            console.log('paramKey: ', paramKey);
            return true;
          }
          else if (keys.includes(pk) && negationKeyIndex !== undefined) {
            // if(index === paramKey.length-1){
            negationKeyIndex = undefined;
            // }
            // console.log('case 2');
            console.log('keys: ', keys);
            console.log('paramKey: ', paramKey);
            return false;
          }
          else if (!keys.includes(pk) && negationKeyIndex === undefined) {
            // the following check param.includes(':') is to check if the param is a time range of special case.
            // specialCaseTimeValue 1:00, 1:01, 1:02 ..... 11:58, 11:59, 12:00 
            if (otherKeys.includes(param) || param.includes(':')) {

              if (param === 'non' || param === 'do not include') {

                if (index === paramKey.length - 1) {
                  negationKeyIndex = queryParams.indexOf(param);

                }
                console.log('other keys(negation)');
                // console.log('case 4');

                console.log(param);
                return true;

              } else {
                // console.log('case 5');

                console.log('other keys');
                console.log(param);
                return true;
              }

            } else {
              // console.log('case 6');

              return false;
            }
          }
          else {
            // console.log('case 7');
            return false;
          }
        });
        if (res) {
          console.log('Match found: ', res);
          console.log('word is: ', paramKey);
          console.log('key is: ', keys);

          break;
        }
      }

      if (!res && negationKeyIndex !== undefined) {
        res = true;
        negationKeyIndex = undefined;
      } else if (!res && negationKeyIndex === undefined) {
        console.log('Result for this parma is:', res);
        console.log('word is: ', paramKey);
      }

      return res;
    });
  }



  isVenueClosingTimeMatch(eventEndTime: string, userRequestedTimeStr: string, dayTimeTokens: string[]) {

    try {
      let requestedTimeDate = new Date();
      let eventEndTimeDate;

      // Parse the closing time string into a Date object
      eventEndTimeDate = parse(eventEndTime, 'HH:mm:ss', new Date());

      // Parse the user requested time string into a Date object
      requestedTimeDate = parse(userRequestedTimeStr, 'h:mm aaaa', new Date());

      console.log('requestedTimeDate: ', requestedTimeDate);

      console.log('eventEndTimeDate: ', eventEndTimeDate);

      if (isEqual(requestedTimeDate, eventEndTimeDate)) {
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


  findCommonDayTimeTokens(foundWords: string[]) {
    let commonDayTimeTokens: string[] = [];

    for (let word of foundWords) {
      console.log('word: ', word);
      for (let key of this.dayTimeKeywords) {

        if (word.includes(':') && key.includes(':')) {
          console.log("word is", word);

          let splitWord = word.split(':');
          let splitKey = key.split(':');

          if (splitWord[0] === splitKey[0]) {
            console.log('splitToken:', splitWord);
            console.log('splitKey: ', splitKey);
            commonDayTimeTokens.push(word);
            break;
          }

        } else if (!word.includes(':') && !key.includes(':')) {
          if (word === key) {
            commonDayTimeTokens.push(word);
            break;
          }
        }

      }

    }
    return commonDayTimeTokens;
  }

  standardizeHour(hour: string) {
    if (hour.includes(':')) {
      return hour;
    } else {
      return `${hour}:00`;
    }
  }

  dismissModal() {
    console.log('stopSpeechRecognition');
    SpeechRecognition.stop();
    this.isAIModalOpen = false;
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
    this.segmentModel = 'venu';
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.HideFilter();
    this.segmentModel = 'venu';
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.HideFilter();
    this.segmentModel = 'venu';
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
  async goToVenuDetail(opt: any) {
    await this.rest.presentToast('Please wait..');
    console.log("detail opt", opt);
    await this.getVenuesSuggested(opt);
    this.setClaimedVenueRemTime();
  }


  async getVenuesSuggested(opt: any) {
    let data = {
      // longitude:"71.4706624",
      // lattitude:"30.2170521",
      longitude: this.longitude,
      lattitude: this.latitude,
      venues_id: opt.venues_id,
      users_customers_id: this.userID,
    };
    this.rest.sendRequest("venues_suggested", data).subscribe(
      {
        next: (res: any) => {
          console.log("Response venues_suggested : ", res);
          if (res.status == "success") {
            this.venueList = [];
            this.venueList.push(opt);
            for (let i = 0; i < res.data.length; i++) {
              this.venueList[i + 1] = res.data[i];
            }
            // res.data.push(opt);
            // this.venueList = res.data;
            // // this.venueList.push(res.data);
            console.log("Response venues_suggested123: ", this.venueList);

            this.showVenueModal();
          } else {
            this.venueList = [];
            this.HideFilter();
            console.log("opt: ", opt);
            this.rest.detail = opt;
            this.rest.comingFrom = 'home';
            this.router.navigate(["venuedetail"]);
          }
        },
        error: (err) => {
          console.log("API Errror: ", err);
        }
      }
    );
  }

  setClaimedVenueRemTime() {
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    let totalMinutes = 0;
    if (this.claimedVenues.length) {
      for (let venue of this.claimedVenues) {
        const resultMinutes = eachMinuteOfInterval({
          start: new Date(venue.claimed_date),
          end: new Date()
        });
        totalMinutes = resultMinutes.length;
        // console.log(totalMinutes);
        hours = Math.floor(totalMinutes / 60);
        minutes = totalMinutes % 60;
        seconds = 0;
        // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
        if (hours <= 23) {
          hours = 23 - hours;
          minutes = 59 - minutes;
          seconds = 59 - seconds;
          venue.remaining_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
          venue.remaining_time = null;
        }


        // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
      }
      this.rest.claimedVenues = this.claimedVenues;
      console.log("claimed venues: ", this.claimedVenues);

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
      console.log("data123: ", data);
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

  async goToReservationDetail(ev: any) {
    await this.rest.presentToast('Please wait..');
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

  clearFilterEv() {
    this.filterTypeEv = 'no'
    this.eventarr = this.eventsArrayCopy;
    this.noevent = 0;
  }

  userdata: any = "";
  userID: any = "";
  records_limit: any = 0;

  async ionViewWillEnter() {
    this.getSystemSettings();
    await this.getCurrentPosition();

    this.records_limit = localStorage.getItem("records_limit");
    this.noevent = 0;
    this.noReservations = 0;
    this.noevenu = 0;
    this.userdata = localStorage.getItem("userdata");
    this.pageNumber = 1;
    console.log("records_limit----", this.records_limit);
    this.userID = JSON.parse(this.userdata).users_customers_id;
    // if(this.timeInMinutes == 0){
    //   this.alwaysSendCurrentLocation();
    //   console.log("time in minutes:",this.timeInMinutes);
    //   console.log("time in minutes is not zero");

    // }else{
    //   console.log("time in minutes:",this.timeInMinutes);      
    // }

    this.getClaimedVenues();
    this.getVenueAIKeywords();
    this.getEventAIKeywords();
    if (this.segmentModel == 'venu') {
      this.getVenues();
    } else if (this.segmentModel == 'reservation') {
      this.getReservations();
    } else {
      this.getEvents();
    }
    this.ai = JSON.parse(this.userdata).ai_feature;
    // this.segmentModel = 'venu';
    if (this.ai == "No") {
      this.aiToggleChecked = false;
    } else {
      this.aiToggleChecked = true;
    }

  }

  getVenues() {
    this.noevenu = 0;
    this.pageNumber = 1;
    // this.filtertype = "no";
    console.log('get venues called');

    var ss = JSON.stringify({
      // longitude: localStorage.getItem("longitude"),
      // lattitude: localStorage.getItem("lattitude"),
      longitude: this.longitude,
      lattitude: this.latitude,
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });
    console.log('venue payloads', ss);


    if (this.venuarr.length == 0) {
      this.rest.presentLoader();
    }

    this.rest.venues(ss).subscribe({
      next: (res: any) => {
        console.log("venues---", res);
        if (this.venuarr.length == 0) {

          this.rest.dismissLoader();
        }
        // this.getEvents();
        if (res.status == "success") {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].cover_images = `${this.rest.baseURLimg}${res.data[i].cover_image}`
          }

          if (this.filtertype == 'no') {
            this.venuarr = res.data.sort((a: any, b: any) => {
              return a.distance - b.distance;
            });



            console.log('venuArray: ', this.venuarr);

            // //FILTER VENUES NEAR USER LOCATION
            // this.getVenuesNearUserLocation();

            this.rest.venuesArray = this.venuarr;
            console.log("this.rest.venuesArray: ", this.rest.venuesArray);

            this.venuarrOrg = this.venuarr;
            console.log('venuarrOrg: ', this.venuarrOrg);

            this.filteredvenuarr = this.venuarrOrg;
            this.rest.venuArrHome = this.venuarr;

            console.log('venuArrHome: ', this.rest.venuArrHome);
          } else {
            this.venuarrOrg = res.data.sort((a: any, b: any) => {
              return a.distance - b.distance;
            });

            // //FILTER VENUES NEAR USER LOCATION
            // this.getVenuesNearUserLocation();

            this.rest.venuesArray = this.venuarrOrg;
            console.log("this.rest.venuesArray: ", this.rest.venuesArray);

            this.filteredvenuarr = this.venuarrOrg;
            this.rest.venuArrHome = this.venuarrOrg;

            console.log('venuArrHome: ', this.rest.venuArrHome);
          }

        } else {
          // this.rest.presentToast(res.message);
          this.noevenu = 1;
          this.venuarr = [];
          this.rest.venuesArray = [];
          this.venuarrOrg = [];
          this.filteredvenuarr = [];
          this.rest.venuArrHome = [];
        }
        // this.initialize();
      },
      error: (error: any) => {
        this.rest.presentToast("Server error. Try again later.");
        this.rest.dismissLoader();
      }
    });
  }

  getReservations() {
    const getReservationFeatureStatus = this.getSystemSettings();
    console.log('getReservationFeatureStatus: ', getReservationFeatureStatus);
    console.log('now calling reservation');

    this.noReservations = 0;
    this.pageNumber = 1;
    // this.reservationFilter = "no";
    if (this.reservationFeature === 'On') {
      console.log('starting');

      console.log('get Reservations called');

      var ss = JSON.stringify({
        // longitude: localStorage.getItem("longitude"),
        // lattitude: localStorage.getItem("lattitude"),
        longitude: this.longitude,
        lattitude: this.latitude,
        users_customers_id: this.userID,
        page_number: this.pageNumber,
      });

      console.log('reservation payloads', ss);


      if (this.filteredReservationsArr.length == 0) {

        this.rest.presentLoader();
      }

      this.rest.reservations(ss).subscribe({
        next: (res: any) => {
          console.log("get reservations res: ", res);
          if (this.filteredReservationsArr.length == 0) {

            this.rest.dismissLoader();
          }

          if (res.status == 'success') {

            if (this.reservationFilter == 'no') {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].cover_images = `${this.rest.baseURLimg}${res.data[i].cover_images}`;
              }
              this.reservationsArr = res.data.sort((a: any, b: any) => {
                return a.distance - b.distance;
              });
              this.filteredReservationsArr = this.reservationsArr;

              console.log("Reservations Array: ", this.reservationsArr);
            } else {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].cover_images = `${this.rest.baseURLimg}${res.data[i].cover_images}`;
              }
              this.reservationsArr = res.data.sort((a: any, b: any) => {
                return a.distance - b.distance;
              });

              console.log("Reservations Array: ", this.reservationsArr);
            }


          }
          else {
            this.noReservations = 1;
            this.reservationsArr = [];
            this.filteredReservationsArr = [];
          }
        },
        error: (error: any) => {
          this.rest.presentToast("Server error. Try again later.");
          this.rest.dismissLoader();
        }
      });
    }

  }

  getEvents() {
    this.noevent = 0;
    this.pageNumber = 1;
    // this.filterTypeEv = "no";
    console.log('get Events called');

    var ss = JSON.stringify({
      // longitude: localStorage.getItem("longitude"),
      // lattitude: localStorage.getItem("lattitude"),
      longitude: this.longitude,
      lattitude: this.latitude,
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });
    console.log("events payloads", ss);

    if (this.eventarr.length == 0) {
      this.rest.presentLoader();
    }

    this.rest.events(ss).subscribe({
      next: (res: any) => {
        console.log("events---", res);
        if (this.eventarr.length == 0) {

          this.rest.dismissLoader();
        }
        if (res.status == "success") {

          if (this.filterTypeEv == 'no') {
            this.eventarr = res.data.sort((a: any, b: any) => {
              // console.log("test");
              return a.distance - b.distance;
            });

            this.eventsArrayCopy = this.eventarr
            this.rest.eventArrHome = this.eventarr;
          } else {
            this.eventsArrayCopy = res.data.sort((a: any, b: any) => {
              // console.log("test");
              return a.distance - b.distance;
            });
            this.rest.eventArrHome = this.eventarr;
          }

        } else {
          // this.rest.presentToast(res.message);
          this.noevent = 1;
          this.eventarr = [];
          this.eventsArrayCopy = [];
        }
      }, error: (error: any) => {
        this.rest.presentToast("Server error. Try again later.");
        this.rest.dismissLoader();
      }
    });
  }

  getSystemSettings(): number {
    this.rest.system_settings().subscribe((res: any) => {
      console.log("system_settings res: ", res);
      this.rest.systemSettings = res.data;
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].type == "reservation_feature") {
          this.reservationFeature = res.data[i].description;
          console.log("reservationFeature: ", this.reservationFeature);
        }
      }
    });
    return 1;
  }



  handleRefresh(ev: any) {
    console.log("ev123-----", ev);
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    this.ionViewWillEnter();
  }

  onIonInfinite(ev: any, value: String) {
    console.log("ev123InFinite", ev);

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
    if (value == 'events') {
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
    else if (value == 'venues') {
      this.rest.venues(ss).subscribe((res: any) => {
        console.log("updated venues response---", res);
        this.rest.dismissLoader();
        if (res.status == "success") {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].cover_images = `${this.rest.baseURLimg}${res.data[i].cover_image}`;
          }
          this.venuarr = this.venuarr.concat(
            res.data.sort((a: any, b: any) => {
              // console.log("testppppppppppopopopopopoopopopopopopopopo");
              return a.distance - b.distance;
            })
          );
          // this.getVenuesNearUserLocation();
          console.log("Updated Venu Array", this.venuarr);

          this.venuarrOrg = this.venuarr;
          // this.venuarrOrg = this.venuarr.concat(
          //   res.data.sort((a: any, b: any) => {
          //     // console.log("testppppppppppopopopopopoopopopopopopopopo");
          //     return a.distance - b.distance;
          //   })
          // );
          this.filteredvenuarr = this.venuarr;
          console.log("Updated filtered Venu Array", this.venuarr);
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
    else if (value == 'reservations') {
      this.rest.reservations(ss).subscribe((res: any) => {
        this.rest.dismissLoader();
        if (res.status == 'success') {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].cover_images = `${this.rest.baseURLimg}${res.data[i].cover_images}`;
          }
          this.reservationsArr = this.reservationsArr.concat(res.data.sort((a: any, b: any) => {
            return a.distance - b.distance;
          }));

          this.filteredReservationsArr = this.reservationsArr;

          console.log("Updated Reservations Array: ", this.reservationsArr);

        }
        else {
          // this.noReservations = 1;
        }
      });
    }
    else { }

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

    const { data, role } = await modal.onWillDismiss();
    if (role == 'success') {
      let filteredEvents = [];
      // console.log("data recieved",data);
      let date = data.eventDate;
      let address = data.address;

      let filterAddressTokens = [];
      let eventAddressTokens = [];
      if (date === 'Date' && address !== undefined) {
        // filter by address

        filterAddressTokens = address.split(',');
        console.log("filterAddressTokens", filterAddressTokens);

        for (let i = 0; i < this.eventsArrayCopy.length; i++) {
          // console.log(this.eventsArrayCopy[i]);
          eventAddressTokens = this.eventsArrayCopy[i].location.split(',');
          if (eventAddressTokens[0] == filterAddressTokens[0]) {
            filteredEvents.push(this.eventsArrayCopy[i]);
          }

        }
      } else if (date !== 'Date' && address === undefined) {
        // filter by date
        for (let i = 0; i < this.eventsArrayCopy.length; i++) {
          // console.log(this.eventsArrayCopy[i]);
          if (this.eventsArrayCopy[i].event_date == date) {
            filteredEvents.push(this.eventsArrayCopy[i]);
          }
        }
      }
      else if (date !== 'Date' && address !== undefined) {
        // filter by date and address

        filterAddressTokens = address.split(',');
        console.log("filterAddressTokens", filterAddressTokens);

        for (let i = 0; i < this.eventsArrayCopy.length; i++) {
          // console.log(this.eventsArrayCopy[i]);
          eventAddressTokens = this.eventsArrayCopy[i].location.split(',');
          if (eventAddressTokens[0] == filterAddressTokens[0] && this.eventsArrayCopy[i].event_date == date) {
            filteredEvents.push(this.eventsArrayCopy[i]);
          }
        }
      } else {

      }
      this.filterTypeEv = 'yes';
      this.eventarr = filteredEvents;
      if (this.eventarr.length == 0) {
        this.noevent = 1;
      } else {
        this.noevent = 0;
      }
      console.log("Ev Arr...", this.eventarr);
    } else if (role == 'error') {
      // this.filterTypeEv = 'yes';
      // this.eventarr = data;
      // console.log("Ev Arr...", this.eventarr);
    } else {

    }


  }


  gotoEventDetail() {
    this.rest.comingFrom = 'home';
    this.router.navigate(["eventdetail"]);
  }

}



