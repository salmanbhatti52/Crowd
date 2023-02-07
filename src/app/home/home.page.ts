import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { AnyARecord } from "dns";
import { RestService } from "../rest.service";
import { SelectVenuePopupPage } from "../select-venue-popup/select-venue-popup.page";
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  segmentModel = "venu";
  showfilter = false;
  venuarr: any = [];
  venuarrOrg: any = "";

  eventarr: any = [];
  filtertype: any = "no";

  noevent = 0;
  noevenu = 0;

  pageNumber = 1;
  latitude: any;
  longitude: any;
  venueList: any;
  selectedVenue= {};
  selectedVenueName =  '';
  constructor(public router: Router, public rest: RestService,
    public modalCtrlr:ModalController,
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

  async getCurrentPosition(){
    const getCurrentLocation = await Geolocation.getCurrentPosition({
      enableHighAccuracy:true
    });
    console.log('Current Location: ',getCurrentLocation);
    this.latitude = getCurrentLocation.coords.latitude;
    this.longitude = getCurrentLocation.coords.longitude;
    console.log('Latitude: ',this.latitude);
    console.log('Longitude: ',this.longitude);

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

  async showVenueModal(){
    const modal = await this.modalCtrlr.create({
      component:SelectVenuePopupPage,
      cssClass: 'select_venue',
      componentProps: {venue_list:this.venueList} ,
      
      // cssClass: (result>24)? 'cancel_booking' : 'cancel_booking2',
      showBackdrop:true
    });
    modal.present();
    const {data, role} = await modal.onWillDismiss();
    if(role === 'value_sent'){
      console.log(data);
      this.selectedVenueName = data;
      console.log("selectedVenueName:",this.selectedVenueName);
      for(let dt of this.venueList){
          console.log("selectedVenueNameinLoop:",this.selectedVenueName);
          console.log("Entered in loop");
          console.log(dt);
          console.log(dt.name);
          // console.log(this.selectedVenue);
          this.selectedVenue = {};
          console.log(this.selectedVenue);
          
          if(dt.name == this.selectedVenueName){
            this.selectedVenue = dt;
            this.HideFilter();
            console.log(this.selectedVenue);
            this.rest.detail = this.selectedVenue;
            this.router.navigate(["venuedetail"]);
          }
        }
    }
  }
  getVenuesSuggested(opt:any){
    
    let data = {
      // longitude:"71.4706624",
      // lattitude:"30.2170521",
      longitude:this.longitude,
      lattitude:this.latitude,
      venues_id:opt.venues_id,
      users_customers_id:this.userID   
    }
    this.rest.presentLoader();
    this.rest.sendRequest('venues_suggested',data).subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Response venues_suggested : ",res);
      if(res.status == 'success'){
        this.venueList = res.data;
        this.showVenueModal();
        
        
      }else{
        this.venueList = []
        this.HideFilter();
        console.log(opt);
        this.rest.detail = opt;
        this.router.navigate(["venuedetail"]);
      }
      
    },(err)=>{
      this.rest.dismissLoader();
      console.log("API Errror: ",err);
      
    })
    
  }
  

  goToDetail(opt: any) {
    this.getVenuesSuggested(opt);

      // this.HideFilter();
      // console.log(opt);
      // this.rest.detail = opt;
      // // this.router.navigate(["venuedetail"]);
    
    
  }

  goToDetailevent(opt: any) {
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
  userID: any = "";
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
      // longitude: "71.513317",
      // lattitude: "30.204700",
      page_number: this.pageNumber,
    });
    console.log("aliiiiiiiiiiiiiii", ss);
    this.rest.events(ss).subscribe((res: any) => {
      console.log("events---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.eventarr = res.data.sort((a: any, b: any) => {
          console.log("testppppppppppopopopopopoopopopopopopopopo");
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
          console.log("testppppppppppopopopopopoopopopopopopopopo");
          return a.distance - b.distance;
        });
        this.venuarrOrg = res.data.sort((a: any, b: any) => {
          console.log("testppppppppppopopopopopoopopopopopopopopo");
          return a.distance - b.distance;
        });

        this.rest.venuArrHome = res.data.sort((a: any, b: any) => {
          console.log("testppppppppppopopopopopoopopopopopopopopo");
          return a.distance - b.distance;
        });
      } else {
        // this.rest.presentToast(res.message);
        this.noevenu = 1;
      }
    });
  }

  handleRefresh(ev: any) {
    console.log("ev-----", ev);
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    this.ionViewWillEnter();
  }
  onIonInfinite(ev: any) {
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
      // longitude: "71.513317",
      // lattitude: "30.204700",
      page_number: this.pageNumber,
    });
    console.log("aliiiiiiiiiiiiiii", ss);
    this.rest.events(ss).subscribe((res: any) => {
      console.log("events---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.eventarr = this.eventarr.concat(
          res.data.sort((a: any, b: any) => {
            console.log("testppppppppppopopopopopoopopopopopopopopo");
            return a.distance - b.distance;
          })
        );
      } else {
        // this.rest.presentToast(res.message);
        // this.noevent = 1;
      }
    });

    this.rest.venues(ss).subscribe((res: any) => {
      console.log("venues---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.venuarr = this.venuarr.concat(
          res.data.sort((a: any, b: any) => {
            console.log("testppppppppppopopopopopoopopopopopopopopo");
            return a.distance - b.distance;
          })
        );
        this.venuarrOrg = this.venuarr.concat(
          res.data.sort((a: any, b: any) => {
            console.log("testppppppppppopopopopopoopopopopopopopopo");
            return a.distance - b.distance;
          })
        );

        this.rest.venuArrHome = this.venuarr.concat(
          res.data.sort((a: any, b: any) => {
            console.log("testppppppppppopopopopopoopopopopopopopopo");
            return a.distance - b.distance;
          })
        );
      } else {
        // this.rest.presentToast(res.message);
        // this.noevenu = 1;
      }
    });
  }
}
