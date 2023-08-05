import { FilterPage } from "./../filter/filter.page";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
// import { AnyARecord } from "dns";
import { RestService } from "../rest.service";
import { SelectVenuePopupPage } from "../select-venue-popup/select-venue-popup.page";
import { Geolocation } from "@capacitor/geolocation";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { MapGeocoder, MapGeocoderResponse } from "@angular/google-maps";
declare var google: any;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  segmentModel = "venu";
  showfilter = false;
  venuarr: any = [];
  venusNearUserLoc: any = [];
  venuarrOrg: any = "";
  number = "123";
  eventarr: any = [];
  filtertype: any = "no";
  filterTypeEv: any = "no";
  // venusArray:any = []
  venues!: Observable<any>
  noevent = 0;
  noevenu = 0;

  pageNumber = 1;
  latitude: any;
  longitude: any;
  venueList: any;
  selectedVenue = {};
  selectedVenueName = "";

  filteredvenuarr: any = "";
  eventsArray: any;
  eventsArrayCopy: any;
  venuesFromGoogle:any = [];
  constructor(
    public router: Router,
    public rest: RestService,
    public modalCtrlr: ModalController,
    private http:HttpClient,
    private geoCoder: MapGeocoder
  ) {}
  
  ngOnInit() {
    
  }

  map!: google.maps.Map;
  service!: google.maps.places.PlacesService;

  initialize() {
    let lat = localStorage.getItem("lattitude");
    let lng = localStorage.getItem("longitude");

    var pyrmont = new google.maps.LatLng(lat,lng);

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      // zoom: 15
    });

    let request = {
      location: pyrmont,
      radius: 2415,
      type: 'restaurant'
    };

    this.service = new google.maps.places.PlacesService(this.map);
    this.service.nearbySearch(request, this.callback);
  }

  callback = (results:google.maps.places.PlaceResult[] | null, status:google.maps.places.PlacesServiceStatus) => {
    console.log("nearByyyyyyy Results: ",results);
    
    this.venuesFromGoogle = results;
    this.addMissingVal();
  }

  addMissingVal(){
    
    for(let i=0; i<this.venuesFromGoogle.length; i++){

      this.venuesFromGoogle[i].likes = null;
      this.venuesFromGoogle[i].discount_percentage = null;
      if(this.venuesFromGoogle[i].photos){
        // console.log("venuesFromGoogle[i].photos",this.venuesFromGoogle[i].photos[0].getUrl());
        
        this.venuesFromGoogle[i].cover_images = this.venuesFromGoogle[i].photos[0].getUrl();
      }else{
        
        this.venuesFromGoogle[i].cover_images = this.venuesFromGoogle[i].icon;
      }
      if(this.venuesFromGoogle[i].opening_hours){

        // console.log("venuesFromGoogle[i].opening_hours.isOpen()",this.venuesFromGoogle[i].opening_hours.isOpen());
      }
      
      this.venuesFromGoogle[i].lattitude = this.venuesFromGoogle[i].geometry.location?.lat();
      this.venuesFromGoogle[i].longitude = this.venuesFromGoogle[i].geometry.location?.lng();

      // Venue coordinates
      const venueLatitude = this.venuesFromGoogle[i].lattitude // Venue's latitude
      const venueLongitude = this.venuesFromGoogle[i].longitude // Venue's longitude

      // Calculate the distance between the user and the venue
      const distance = this.calculateDistance(this.latitude, this.longitude, venueLatitude, venueLongitude);

      // console.log('Distance (in miles):', distance);
      this.venuesFromGoogle[i].distance = distance
      this.venuesFromGoogle[i].googleRating = this.venuesFromGoogle[i].rating
      this.venuesFromGoogle[i].google_place_id = this.venuesFromGoogle[i].place_id
      this.venuesFromGoogle[i].close_hours = this.venuesFromGoogle[i].opening_hours?.isOpen();
      
      this.venuesFromGoogle[i].location = this.venuesFromGoogle[i].vicinity  
      
      if(this.venuesFromGoogle[i].types){
        this.venuesFromGoogle[i].description = this.venuesFromGoogle[i].types.join(', ')
      }
      
      this.venuesFromGoogle[i].status =  this.venuesFromGoogle[i].business_status;
      this.venuesFromGoogle[i].venues_id =  null;
      this.venuesFromGoogle[i].public_check_ins =  0;
      this.venuesFromGoogle[i].availability =  'null';
      
    }

    console.log("venuesFromGoogle: ",this.venuesFromGoogle);
    this.venuarr = this.venuarr.concat(
      this.venuesFromGoogle.sort((a: any, b: any) => {
        // console.log("testppppppppppopopopopopoopopopopopopopopo");
        return a.distance - b.distance;
      })
    );
    this.rest.venuArrHome = this.venuarr;
    console.log('venuArrUpdatedGoogleEvents: ',this.rest.venuArrHome);
    this.filteredvenuarr = this.venuarr;
    console.log('filteredVenuArrUpdatedGoogleEvents: ',this.filteredvenuarr);
  }

  async getAddress(lat:any, lng:any) {
    let address:any;
    this.geoCoder
      .geocode({ location: { lat: lat, lng: lng } })
      .subscribe(
        (addr: MapGeocoderResponse) => {
          console.log("Addressss: ",addr);
          address = addr;
          
          if (address.status === "OK") {
            if (address.results.length) {
              for(let i = 0; i<address.results.length; i++){ 
                if(address.results[i].types.length == 3){
                  console.log("address found===", address.results[i].formatted_address);
                  return address.results[i].formatted_address;
                }
              }
            } else {
              return "";
              window.alert("No results found");
            }
          } else {
            return "";
            window.alert("Geocoder failed due to: " + addr.status);
          }
        },
        (err) => {
          console.log("Errrrr",err);
        }
      );
  }

  // Function to calculate the distance between two coordinates using the Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    
    //  Convert the distance from kilometers to miles
    const distanceInMiles = distance * 0.621371;
    return distanceInMiles;
  }

  // Function to convert degrees to radians
  toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
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
    console.log("rrr", this.segmentModel);
    // this.type = ev
    console.log("eee", event);
  }

  goToVenuDetail(opt: any) {
    this.getVenuesSuggested(opt);

    // this.HideFilter();
    // console.log(opt);
    // this.rest.detail = opt;
    // // this.router.navigate(["venuedetail"]);
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
      (err) => {
        this.rest.dismissLoader();
        console.log("API Errror: ", err);
      }
    );
  }

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
    // this.venueList = [];
          // this.HideFilter();
          // console.log("opt: ",opt);
          // this.rest.detail = opt;
          // this.router.navigate(["venuedetail"]);
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
  }

  clearFilterEv(){
    this.filterTypeEv = 'no'
    this.eventarr = this.eventsArrayCopy
  }
  
  userdata: any = "";
  userID : any = "";
  records_limit: any = 0;
  
  ionViewWillEnter() {
    this.getCurrentPosition();
    this.filtertype = "no";
    this.records_limit = localStorage.getItem("records_limit");
    this.noevent = 0;
    this.noevenu = 0;
    this.userdata = localStorage.getItem("userdata");
    this.pageNumber = 1;
    console.log("records_limit----", this.records_limit);
    this.userID = JSON.parse(this.userdata).users_customers_id;
    this.rest.presentLoader();

    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });
    
    console.log("payload: ", ss);
    console.log("localStorage longitude: ",localStorage.getItem("longitude"));
    console.log("localStorage lattitude: ",localStorage.getItem("lattitude"));
    console.log("longitude ", this.longitude);
    console.log("lattitude ", this.latitude );
    
    
    this.rest.events(ss).subscribe((res: any) => {
      console.log("events---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.eventarr = res.data.sort((a: any, b: any) => {
          // console.log("testppppppppppopopopopopoopopopopopopopopo");
          return a.distance - b.distance;
        });
        this.eventsArrayCopy = this.eventarr
      } else {
        // this.rest.presentToast(res.message);
        this.noevent = 1;
      }
    });

    this.rest.venues(ss).subscribe((res: any) => {
      console.log("venues---", res);
      
      this.rest.dismissLoader();
      if (res.status == "success") {
        for(let i=0; i<res.data.length; i++){
          res.data[i].cover_images =  `${this.rest.baseURLimg}${res.data[i].cover_images}`
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
      }
      this.initialize();
    });
    

  }

  handleRefresh(ev: any) {
    console.log("ev123-----", ev);
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    this.ionViewWillEnter();
  }
  
  onIonInfinite(ev: any) {
    console.log("ev123InFinite",ev);
    
    this.pageNumber++;
    console.log("ev-----", this.pageNumber);
    console.log("records_limit-----", localStorage.getItem("records_limit"));
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    this.rest.presentLoader();
    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      page_number: this.pageNumber,
    });
    console.log("OnIonInfiniete data ss", ss);
    
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

    this.rest.venues(ss).subscribe((res: any) => {
      console.log("updated venues response---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        for(let i=0; i<res.data.length; i++){
          res.data[i].cover_images =  `${this.rest.baseURLimg}${res.data[i].cover_images}`
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
        this.filteredvenuarr = this.venuarr
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
    });

    
  }

  searchReservations(event: any) {
    this.filteredvenuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      // console.log(this.venuarrOrg[i].name.toLowerCase());
      console.log(event.target.value.toLowerCase());

      if (
        this.venuarrOrg[i].name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        this.filteredvenuarr.push(this.venuarrOrg[i]);
      }
    }

    console.log("item------", this.filteredvenuarr);
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
      this.filterTypeEv = 'yes';
      this.eventarr = data;
      console.log("Ev Arr...", this.eventarr);
    }else if(role == 'error'){
      this.filterTypeEv = 'yes';
      this.eventarr = data;
      console.log("Ev Arr...", this.eventarr);
    }else{

    }


  }


  gotoEventDetail(){
    this.rest.comingFrom = 'home';
    this.router.navigate(["eventdetail"]);
  }

}



