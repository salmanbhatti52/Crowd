import { FilterPage } from "./../filter/filter.page";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
// import { AnyARecord } from "dns";
import { RestService } from "../rest.service";
import { SelectVenuePopupPage } from "../select-venue-popup/select-venue-popup.page";
import { Geolocation } from "@capacitor/geolocation";
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

  noevent = 0;
  noevenu = 0;

  pageNumber = 1;
  latitude: any;
  longitude: any;
  venueList: any;
  selectedVenue = {};
  selectedVenueName = "";

  filteredvenuarr: any = "";
  constructor(
    public router: Router,
    public rest: RestService,
    public modalCtrlr: ModalController
  ) {}
  ngOnInit() {}
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

  getVenuesOfCurrentLocation(){
    console.log("getVenuesOfCurrentLocationCalled");

   this.rest.getNearbyVenues(`location=${this.latitude}%2C${this.longitude}&radius=1500&type=restaurant&keyword=cruise&key=`).subscribe(res=>{
  //  this.rest.getNearbyVenues(`location=-33.8670522%2C151.1957362&radius=1500&type=restaurant&keyword=cruise&key=`).subscribe(res=>{
    
  console.log("venuesNearCurrentLocation: ",res);
    
   });
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
    this.getVenuesOfCurrentLocation();
    // console.log("printCurrentPosition: ",printCurrentPosition);
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
          this.venueList = res.data;
          console.log("Response venues_suggested123: ",this.venueList);
          
          this.showVenueModal();
        } else {
          this.venueList = [];
          this.HideFilter();
          console.log("opt: ",opt);
          this.rest.detail = opt;
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
          this.router.navigate(["venuedetail"]);
        }
      }
    }
  }

  goToReservationDetail(ev: any) {
    console.log(ev);
    this.rest.detail = ev;
    this.router.navigate(["booking1"]);
  }

  goToEventDetail(opt: any) {
    this.HideFilter();
    console.log(opt);
    this.rest.detail = opt;
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
      } else {
        // this.rest.presentToast(res.message);
        this.noevent = 1;
      }
    });

    this.rest.venues(ss).subscribe((res: any) => {
      console.log("venues---", res);
      
      this.rest.dismissLoader();
      if (res.status == "success") {
        
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
        this.venuarr = this.venuarr.concat(
          res.data.sort((a: any, b: any) => {
            // console.log("testppppppppppopopopopopoopopopopopopopopo");
            return a.distance - b.distance;
          })
        );
        // this.getVenuesNearUserLocation();
        console.log("Updated Venu Array",this.venuarr);
        
        this.venuarrOrg = this.venuarr.concat(
          res.data.sort((a: any, b: any) => {
            // console.log("testppppppppppopopopopopoopopopopopopopopo");
            return a.distance - b.distance;
          })
        );

        this.rest.venuArrHome = this.venuarr.concat(
          res.data.sort((a: any, b: any) => {
            // console.log("testppppppppppopopopopopoopopopopopopopopo");
            return a.distance - b.distance;
          })
        );
        

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
    // this.filteredvenuarr = [];
    // for (var i = 0; i < this.venuarrOrg.length; i++) {
    //   // console.log(this.venuarrOrg[i].name.toLowerCase());
    //   console.log(event.target.value.toLowerCase());

    //   if (
    //     this.venuarrOrg[i].name
    //       .toLowerCase()
    //       .includes(event.target.value.toLowerCase())
    //   ) {
    //     this.filteredvenuarr.push(this.venuarrOrg[i]);
    //   }
    // }

    // console.log("item------", this.filteredvenuarr);
  }

  async goToFilter() {
    console.log("model123fdd");
    const modal = await this.modalCtrlr.create({
      component: FilterPage,
      cssClass: "riz",
    });

    await modal.present();
  }


  gotoEventDetail(){
    this.router.navigate(["eventdetail"]);
  }

}



