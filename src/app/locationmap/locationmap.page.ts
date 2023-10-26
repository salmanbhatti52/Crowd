import { RestService } from "./../rest.service";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  Renderer2,
} from "@angular/core";
import { Router } from "@angular/router";

import { ModalController, Platform } from "@ionic/angular";
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
import { IonInput } from "@ionic/angular";
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

  constructor(
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    private ngZone: NgZone,
    private geoCoder: MapGeocoder,
    private platform:Platform,
    private mapDirectionsService: MapDirectionsService,
    private renderer: Renderer2
  ) {
    Keyboard.addListener('keyboardWillShow', info => {
      console.log('keyboard will show with height:', info.keyboardHeight);
      this.showDetail = false;
      // this.hideExtraElements();
    });
    
    Keyboard.addListener('keyboardDidShow', info => {
      console.log('keyboard did show with height:', info.keyboardHeight);
      this.showDetail = false;
      // this.hideExtraElements();
    });
    
    // Keyboard.addListener('keyboardWillHide', () => {
     
    //   this.showHiddenElements();

    // });
    
    // Keyboard.addListener('keyboardDidHide', () => {
    //   document.getElementById("textInput")?.blur();
     
      
    //   this.showHiddenElements();
    
    // });
  }

  onInputClick(event: Event) {
    // event.stopPropagation(); // Prevent the click event from propagating further
  }
 


  unFocusInput(){
    // this.renderer.selectRootElement(this.textInput.nativeElement).blur();

    // Keyboard.hide();
   
    // this.showHiddenElements();
    
  }


  getDirections(){

    const request: google.maps.DirectionsRequest = {
      destination: {lat: +this.searchObject.lattitude, lng: +this.searchObject.longitude},
      origin: {lat: this.currentLatitude, lng: this.currentLongitude },
      travelMode: google.maps.TravelMode.DRIVING
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

    // await this.setMarkerPosition(this.dbLati, this.dbLong);
    // this.center = {
    //   lat: this.dbLati,
    //   lng: this.dbLong,
    // };
    this.getCurrentLocation();
    this.map.googleMap?.setZoom(13);
    
  }
  

  
  isIOS() {
    return this.platform.is('ios');
  }

  
  
  // ionViewWillLeave() {
  //   // enable the root left menu when leaving this page
  //   // this.map.destroy();
  // }

  // async createMap() {
  //   this.dismissmodal = 0;
  //   // AIzaSyAncWVozZi9mUrnaxdDJJE_rgRY5M-wD54
  //   // this.map = await GoogleMap.create({
  //   //   id: "my-map", // Unique identifier for this map instance
  //   //   element: this.mapRef?.nativeElement, // reference to the capacitor-google-map element,
  //   //   apiKey: "AIzaSyA7ks8X2YnLcxTuEC3qydL2adzA0NYbl6c", // Your Google Maps API Key
  //   //   forceCreate: true,
  //   //   config: {
  //   //     center: {
  //   //       // The initial position to be rendered by the map
  //   //       lat: 30.2398469,
  //   //       lng: 71.4703882,
  //   //     },

  //   //     zoom: 12, // The initial zoom level to be rendered by the map
  //   //   },
  //   // });

  //   // this.addmarkers();
  // }

  // async addmarkers() {
  //   await this.map.addMarkers(this.markerscheck);
  //   this.map.setOnMarkerClickListener(async (marker: any) => {
  //     this.dismissmodal++;
  //     this.title = marker.title;
  //     this.filterArrypin(marker.title);
  //   });
  //   this.map.setOnInfoWindowClickListener(async (marker: any) => {});
  // }

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
                  url: "assets/imgs/locpin.svg",
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
    console.log("this.venuarr",this.venuarr);
    
    var newVenuArr = [];
    for (var i = 0; i < this.venuarr.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.venuarr[i].lattitude),
          lng: parseFloat(this.venuarr[i].longitude),
        },
        title: "" + this.venuarr[i].public_check_ins,
        name: this.venuarr[i].name,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin.svg",
            size: {
              height: 120,
              width: 30,
            },
          },
        },
      };

      newVenuArr.push(obj);
    }

    this.venuarr = [];
    this.venuarr = newVenuArr;
    this.markers = this.venuarr;
    // this.map.destroy();

    // this.createMap();
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
    // this.searchObject = "";
    // if (this.showfilter) {
    //   this.showfilter = false;
    // } else {
    //   this.showfilter = true;
    // }
    this.showfilter = !this.showfilter;
    this.showCategories = false;

    // this.
    // if (this.modalopen == 1) {
    //   await this.modalCtrl.dismiss();
    // }
    // this.modalopen = 0;
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
            url: "assets/imgs/locpin.svg",
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
    // this.map.destroy();

    // this.createMap();
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
        // size: new google.maps.Size(48, 59),
        // anchor: new google.maps.Point(24, 59),
        // url: "assets/imgs/treeeline.svg",
        //=============== comment by gharsheen start
        // icon: {
        //   url: "assets/imgs/locpin.svg",
        //   size: {
        //     height: 120,
        //     width: 30,
        //   },
        // },
        // =================done=========
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
          icon: {
            url: "assets/imgs/locpin.svg",
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
          // this.infoWindow.setPosition(pos);
          // infoWindow.setContent("Location found.");
          // infoWindow.open(map);
          // map.setCenter(pos);
          this.center = pos;
          this.userLocation = {
            position: {
              lat: pos.lat,
              lng: pos.lng,
            },
            // title: "" + this.venuarrOrg[i].public_check_ins,
            // name: this.venuarrOrg[i].name,
            options: {
              animation: google.maps.Animation.DROP,
              draggable: false,
              icon: {
                url: "../../assets/imgs/icons/location_28.svg",
                // size: {
                //   height: 48,
                //   width: 4,
                // },
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
    // this.setMarkersAgain();
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
            url: "assets/imgs/locpin.svg",
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
    // console.log("modalopen-----", this.modalopen);

    // if (this.modalopen == 1) {
    //   await this.modalCtrl.dismiss();
    //   this.modalopen = 0;
    // }
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
    // navigator.geolocation.getCurrentPosition((position) => {
    //   this.latitude = position.coords.latitude;
    //   this.longitude = position.coords.longitude;
    //   this.center = {
    //     lat: this.dbLati,
    //     lng: this.dbLong,
    //   };
    //   // Set marker position
    //   await this.setMarkerPosition(this.dbLati, this.dbLong);
    // });

    // await this.setMarkerPosition(this.dbLati, this.dbLong);
    
    // this.center = {
    //   lat: this.dbLati,
    //   lng: this.dbLong,
    // };
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

  @ViewChild(MapInfoWindow, { static: false })
  infoWindow!: MapInfoWindow;

  infoContent: string | undefined;

  openInfo(marker: MapMarker, content: string, markerobj: any) {
    // Keyboard.hide();
    this.infoContent = content;
    this.infoWindow.open(marker);
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
