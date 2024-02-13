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

    // Keyboard.addListener('keyboardWillShow', info => {
    //   console.log('keyboard will show with height:', info.keyboardHeight);
    //   this.showDetail = false;
    //   // this.hideExtraElements();
    // });
    
    // Keyboard.addListener('keyboardDidShow', info => {
    //   console.log('keyboard did show with height:', info.keyboardHeight);
    //   this.showDetail = false;
    //   // this.hideExtraElements();
    // });
    
    
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
        console.log("partialResults was fired", data.matches);
        if(data.matches && data.matches.length > 0){  
          this.yourVoiceInput = data.matches[0];
          this.changeDetectorRef.detectChanges();
          
        }
      }).then((res: any) => {});
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
    let filteredVenues = [];
    let foundVenue = false;
    let foundDiscount = false;
    let venueName:string = '';
    let venuNameTokens = [];
    let venuDiscount = '';
    // setTimeout(() => {
    //   this.rest.presentLoaderWd();  
    // }, 1000);
    
    for (let venueIndex = 0; venueIndex < this.venuarr.length; venueIndex++) {
      foundDiscount = false;
      foundVenue = false;
      
      venuDiscount = this.venuarr[venueIndex].discount_percentage.toString() + '%';
      console.log("venuDiscount: ",venuDiscount);
      
      venueName = this.venuarr[venueIndex].name.toLowerCase();
      venuNameTokens = venueName.split(/\s+/);

      console.log(venuNameTokens);

      for (let inputTokenIndex = 0; inputTokenIndex < inputTokens.length; inputTokenIndex++) {

        if(venuNameTokens.includes(inputTokens[inputTokenIndex])){
          
          console.log('Venue Match Found');
          console.log(venuNameTokens);
          console.log(inputTokens[inputTokenIndex]);
          
          foundVenue = true;
        }

        if(venuDiscount == inputTokens[inputTokenIndex]){
          console.log('Discount Match Found');
          console.log(venuDiscount);
          console.log(inputTokens[inputTokenIndex]);
          
          foundDiscount = true;
        }
        
      }

      if(foundVenue || foundDiscount){
        console.log("foundVenue: ",foundVenue);
        console.log("foundDiscount: ",foundDiscount);
        
        filteredVenues.push(this.venuarr[venueIndex]);
     }
      
    }
    this.filtertype = 'yes';
    console.log("filteredVenues: ",filteredVenues); 
    this.venuarr = filteredVenues;
    this.setMarkersForFoundVenues(filteredVenues);
  };

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
    
    this.venuarrOrg = this.rest.venuArrHome;
    console.log("this.venuarrOrg",this.venuarrOrg.length);
    this.makeMarkerArray();
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
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
