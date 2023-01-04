import { PininfoPage } from "./../pininfo/pininfo.page";
import { RestService } from "./../rest.service";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";

import { ModalController } from "@ionic/angular";
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
  MapMarker,
} from "@angular/google-maps";

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

  address = "";
  latitude!: any;
  longitude!: any;
  zoom = 13;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: "roadmap",
    disableDefaultUI: true,
  };
  markers = [] as any;

  //// angular map
  showfilter = false;

  @ViewChild("map") mapRef: any = ElementRef;
  // map: any = GoogleMap;
  title = "Title here";
  venuarr: any = "";
  venuarrOrg: any = "";

  filtertype = "no";

  searchObject: any = "";

  dismissmodal = 0;
  modalopen = 0;

  markerscheck = [
    // {
    //   coordinate: {
    //     lat: 30.2396588,
    //     lng: 71.4848884,
    //   },
    //   snippet: "1",
    //   title: "test venue 1",
    // },
    // {
    //   coordinate: {
    //     lat: 30.208124,
    //     lng: 71.4699251,
    //   },
    //   snippet: "2",
    //   title: "test venue 2",
    // },
    // {
    //   coordinate: {
    //     lat: 30.2164073,
    //     lng: 71.462651,
    //   },
    //   snippet: "hellow i am here dear",
    //   title: "test venue 3",
    // },
  ];

  constructor(
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    private ngZone: NgZone,
    private geoCoder: MapGeocoder
  ) {}

  ionViewDidEnter() {
    this.createMap();
  }

  ionViewWillEnter() {
    this.venuarrOrg = this.rest.venuArrHome;
    this.makeMarkerArray();
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    // this.map.destroy();
  }

  async createMap() {
    this.dismissmodal = 0;
    // AIzaSyAncWVozZi9mUrnaxdDJJE_rgRY5M-wD54
    // this.map = await GoogleMap.create({
    //   id: "my-map", // Unique identifier for this map instance
    //   element: this.mapRef?.nativeElement, // reference to the capacitor-google-map element,
    //   apiKey: "AIzaSyA7ks8X2YnLcxTuEC3qydL2adzA0NYbl6c", // Your Google Maps API Key
    //   forceCreate: true,
    //   config: {
    //     center: {
    //       // The initial position to be rendered by the map
    //       lat: 30.2398469,
    //       lng: 71.4703882,
    //     },

    //     zoom: 12, // The initial zoom level to be rendered by the map
    //   },
    // });

    // this.addmarkers();
  }

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
    this.HideFilter();
    this.router.navigate(["profile"]);
  }

  goToDetail() {
    this.HideFilter();
    this.router.navigate(["venuedetail"]);
  }

  clearFilter() {
    this.HideFilter();
    this.filtertype = "no";
    this.venuarr = this.venuarrOrg;

    var newVenuArr = [];
    for (var i = 0; i < this.venuarr.length; i++) {
      var obj = {
        position: {
          lat: this.venuarr[i].lattitude,
          lng: this.venuarr[i].longitude,
        },
        title: "" + this.venuarr[i].public_check_ins,
        name: this.venuarr[i].name,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
        },
      };

      newVenuArr.push(obj);
    }
    this.venuarr = [];
    this.venuarr = newVenuArr;
    this.markers = this.venuarr;
    // this.map.destroy();

    this.createMap();
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

  async showHideFilterN() {
    this.searchObject = "";
    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }

    if (this.modalopen == 1) {
      await this.modalCtrl.dismiss();
    }
    this.modalopen = 0;
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
          lat: this.venuarr[i].lattitude,
          lng: this.venuarr[i].longitude,
        },
        title: "" + this.venuarr[i].public_check_ins,
        name: this.venuarr[i].name,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
        },
      };
      newVenuArr.push(obj);
    }

    this.venuarr = [];
    this.venuarr = newVenuArr;
    this.markers = this.venuarr;
    // this.map.destroy();

    this.createMap();
  }

  makeMarkerArray() {
    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      var obj = {
        position: {
          lat: this.venuarrOrg[i].lattitude,
          lng: this.venuarrOrg[i].longitude,
        },
        title: "" + this.venuarrOrg[i].public_check_ins,
        name: this.venuarrOrg[i].name,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
        },
      };

      this.venuarr.push(obj);
    }

    this.markers = this.venuarr;
  }

  async HideFilter() {
    this.searchObject = "";
    this.showfilter = false;
    console.log("modalopen-----", this.modalopen);

    if (this.modalopen == 1) {
      await this.modalCtrl.dismiss();
      this.modalopen = 0;
    }
  }

  async goTOinfopage() {
    this.HideFilter();

    const modal = await this.modalCtrl.create({
      component: PininfoPage,
      cssClass: "pinModal",
    });
    await modal.present();

    this.modalopen = 1;
  }

  gotodetail() {
    this.rest.detail = this.searchObject;
    this.HideFilter();
    this.router.navigate(["venuedetail"]);
  }

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    // let autocomplete = new google.maps.places.Autocomplete(
    //   this.searchElementRef.nativeElement
    // );
    // Align search box to center
    // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    //   this.searchElementRef.nativeElement
    // );
    // autocomplete.addListener("place_changed", () => {
    //   this.ngZone.run(() => {
    //     //get the place result
    //     let place: google.maps.places.PlaceResult = autocomplete.getPlace();

    //     //verify result
    //     if (place.geometry === undefined || place.geometry === null) {
    //       return;
    //     }

    //     console.log({ place }, place.geometry.location?.lat());

    //     //set latitude, longitude and zoom
    //     this.latitude = place.geometry.location?.lat();
    //     this.longitude = place.geometry.location?.lng();

    //     // Set marker position
    //     this.setMarkerPosition(30.048418, 72.3129359);

    //     this.center = {
    //       lat: 30.048418,
    //       lng: 72.3129359,
    //     };
    //   });
    // });

    this.setMarkerPosition(30.2088837, 71.4689853);

    this.center = {
      lat: 30.2088837,
      lng: 71.4689853,
    };
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.center = {
        lat: 30.2088837,
        lng: 71.4689853,
      };
      // Set marker position
      this.setMarkerPosition(30.2088837, 71.4689853);
    });
  }

  setMarkerPosition(latitude: any, longitude: any) {
    // Set marker position

    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      var obj = {
        position: {
          lat: this.venuarr[i].lattitude,
          lng: this.venuarr[i].longitude,
        },
        title: "" + this.venuarr[i].public_check_ins,
        name: this.venuarr[i].name,
        options: {
          animation: google.maps.Animation.DROP,
          draggable: false,
        },
      };

      this.venuarr.push(obj);
    }

    this.markers = this.venuarr;
  }

  eventHandler(event: any, name: string) {
    // console.log(event, name);

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
    this.infoContent = content;
    this.infoWindow.open(marker);
    console.log("markerobj-----------", markerobj);
    console.log("content-----------", content);

    this.filterArrypin(markerobj.name);
  }

  async filterArrypin(searchTerm: any) {
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      if (this.venuarrOrg[i].name.toLowerCase() == searchTerm.toLowerCase()) {
        this.searchObject = this.venuarrOrg[i];
      }
    }

    this.rest.pinobject = this.searchObject;

    // this.goTOinfopage();
  }
}
