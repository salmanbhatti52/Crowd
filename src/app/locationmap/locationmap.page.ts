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

  userID: any = "";
  userdata: any = "";
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

  markerscheck = [];

  dbLati: any = "";
  dbLong: any = "";

  a: any = "";
  b: any = "";

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

  async ionViewWillEnter() {
    this.a = localStorage.getItem("lattitude");
    this.b = localStorage.getItem("longitude");
    this.dbLati = parseFloat(this.a);
    this.dbLong = parseFloat(this.b);
    this.venuarrOrg = this.rest.venuArrHome;
    this.makeMarkerArray();
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
    console.log("dbLati---------", this.dbLati);
    console.log("dbLong---------", this.dbLong);

    await this.setMarkerPosition(this.dbLati, this.dbLong);

    this.center = {
      lat: this.dbLati,
      lng: this.dbLong,
    };

    // alert(
    //   "Localstorage The coordinates are latitude=" +
    //     localStorage.getItem("longitude") +
    //     " and longitude=" +
    //     localStorage.getItem("lattitude") +
    //     " and location=" +
    //     localStorage.getItem("location")
    // );
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
          lat: parseFloat(this.venuarr[i].lattitude),
          lng: parseFloat(this.venuarr[i].longitude),
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
          lat: parseFloat(this.venuarr[i].lattitude),
          lng: parseFloat(this.venuarr[i].longitude),
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
          lat: parseFloat(this.venuarrOrg[i].lattitude),
          lng: parseFloat(this.venuarrOrg[i].longitude),
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

    this.center = {
      lat: this.dbLati,
      lng: this.dbLong,
    };
  }

  setMarkerPosition(latitude: any, longitude: any) {
    console.log("marker position");

    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      var obj = {
        position: {
          lat: parseFloat(this.venuarrOrg[i].lattitude),
          lng: parseFloat(this.venuarrOrg[i].longitude),
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
