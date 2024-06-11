import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";
import { eachMinuteOfInterval } from "date-fns";

@Component({
  selector: "app-saved",
  templateUrl: "./saved.page.html",
  styleUrls: ["./saved.page.scss"],
})
export class SavedPage implements OnInit {
  segmentModel = "venu";
  showfilter = false;
  venuarr: any = "";
  venuarrOrg: any = "";
  claimedVenues: any = [];
  eventarr: any = "";
  filtertype: any = "no";

  noevent = 0;
  noevenu = 0;

  constructor(public router: Router, public rest: RestService) {}
  
  
  ngOnInit() {}


  HideFilter() {
    this.showfilter = false;
  }

  tab1Click() {
    this.HideFilter();
    this.segmentModel = 'venu';
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.HideFilter();
    this.segmentModel = 'venu';
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.HideFilter();
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.HideFilter();
    this.segmentModel = 'venu';
    this.router.navigate(["noti"]);
  }

  goToProfile() {
    this.HideFilter();
    this.router.navigate(["profile"]);
  }

  segmentChanged(event: any) {
    this.HideFilter();
    console.log(this.segmentModel);

    console.log(event);
  }

  async goToDetail(opt: any) {
    setTimeout(async () => {
      await this.setClaimedVenueRemTime();
    }, 2000);
    
    this.HideFilter();
    console.log(opt);
    this.rest.detail = opt;
    
    this.router.navigate(["venuedetail"]);
  }

  async setClaimedVenueRemTime(){
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    let totalMinutes = 0;
    if(this.claimedVenues.length){
      for(let venue of this.claimedVenues){
        const resultMinutes = eachMinuteOfInterval({
          start: new Date(venue.claimed_date),
          end: new Date()
        });
        totalMinutes = resultMinutes.length;
        // console.log(totalMinutes);
        hours = Math.floor(totalMinutes / 60) ;
        minutes = totalMinutes % 60;
        seconds = 0;
        // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
        if(hours <= 23){
          hours = 23 - hours;
          minutes = 59 - minutes;
          seconds = 59 - seconds;
          venue.remaining_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        }else{
          venue.remaining_time = null;
        }
       
        
        // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
      }
      this.rest.claimedVenues = this.claimedVenues;
      console.log("claimed venues: ",this.claimedVenues);
      
    }
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

  like(opt: any) {
    this.HideFilter();
    console.log("like---", opt);
  }
  likeout(opt: any) {
    this.HideFilter();
    console.log("likeout---", opt);
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

  showHideFilterN() {
    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }
  }

  clearFilter() {
    this.HideFilter();
    this.filtertype = "no";
    this.venuarr = this.venuarrOrg.sort((a: any, b: any) => {
      console.log("test");
      return a.distance - b.distance;
    });
  }

  userdata: any = "";
  userID: any = "";
  ionViewWillEnter() {
    this.HideFilter();
    this.noevent = 0;
    this.noevenu = 0;
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    this.userID = JSON.parse(this.userdata).users_customers_id;
    
    if(this.segmentModel == 'venu'){
      this.getsavedVenues();
    }else{
      this.getsavedEvents();
    }
    this.getClaimedVenues();
  }

  getsavedVenues() {
    if(this.venuarr.length == 0){
      this.rest.presentLoader();
    }
    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      // longitude: "71.513317",
      // lattitude: "30.204700",
    });
    console.log(ss);
    
    this.rest.venues_saved(ss).subscribe((res: any) => {
      console.log("venues---", res);
      if(this.venuarr.length == 0){
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.venuarr = res.data.sort((a: any, b: any) => {
          // console.log("testppppppppppopopopopopoopopopopopopopopo");
          return a.distance - b.distance;
        });
        this.venuarrOrg = this.venuarr;
        // this.venuarrOrg = res.data.sort((a: any, b: any) => {
        //   // console.log("testppppppppppopopopopopoopopopopopopopopo");
        //   return a.distance - b.distance;
        // });
      } else {
        // this.rest.presentToast(res.message);
        this.venuarr = [];
        this.venuarrOrg = [];
        this.noevenu = 1;
      }
    });
  }

  getsavedEvents() {
    if(this.eventarr.length == 0){
      this.rest.presentLoader();
    }
    var ss = JSON.stringify({
      longitude: localStorage.getItem("longitude"),
      lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      // longitude: "71.513317",
      // lattitude: "30.204700",
    });
    console.log(ss);

    this.rest.events_saved(ss).subscribe((res: any) => {
      console.log("events---", res);
      if(this.eventarr.length == 0){
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.eventarr = res.data.sort((a: any, b: any) => {
          // console.log("testppppppppppopopopopopoopopopopopopopopo");
          return a.distance - b.distance;
        });
      } else {
        // this.rest.presentToast(res.message);
        this.eventarr = [];
        this.noevent = 1;

      }
    });
  }

  getClaimedVenues(){
    let data = {
      "users_customers_id":this.userID
    };
    this.rest.sendRequest('get_claimed_venues',data ).subscribe((res: any)=>{
    console.log("get_claimed_venues",res);
    if(res.status == 'success'){
      this.claimedVenues = res.data;
    }
      
    });
  }

  likeevent(obj: any) {
    console.log("likeevent", obj);

    if (obj.likes == 0) {
      obj.likes = 1;
      this.likeDislikeUSerEvents(obj.events_id);
    }
  }
  likeoutevent(obj: any) {
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
    this.getsavedEvents();
  }

  likevenu(obj: any) {
    console.log("likevenu", obj);

    if (obj.likes == 0) {
      obj.likes = 1;
      this.likeDislikeUServenu(obj.venues_id);
    }
  }
  likeoutvenu(obj: any) {
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
    this.getsavedVenues();
  }

  // clearTheURLEncode(val: any) {
  //   console.log("clearTheURLEncode----", encodeURI(val));

  //   // return encodeURI(val);
  // }
}
