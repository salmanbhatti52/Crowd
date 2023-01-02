import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnyARecord } from "dns";
import { RestService } from "../rest.service";

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

  eventarr: any = "";
  filtertype: any = "no";
  constructor(public router: Router, public rest: RestService) {}
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

  goToDetail(opt: any) {
    this.HideFilter();
    console.log(opt);
    this.rest.detail = opt;
    this.router.navigate(["venuedetail"]);
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
    this.filtertype = "no";
    this.venuarr = this.venuarrOrg;
  }
  userdata: any = "";
  userID: any = "";
  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    this.userID = JSON.parse(this.userdata).users_customers_id;
    this.rest.presentLoader();
    var ss = JSON.stringify({
      // longitude: localStorage.getItem("longitude"),
      // lattitude: localStorage.getItem("lattitude"),
      users_customers_id: this.userID,
      longitude: "71.513317",
      lattitude: "30.204700",
    });
    console.log(ss);
    this.rest.events(ss).subscribe((res: any) => {
      console.log("events---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.eventarr = res.data;
      } else {
        this.rest.presentToast(res.message);
      }
    });

    this.rest.venues(ss).subscribe((res: any) => {
      console.log("venues---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.venuarr = res.data;
        this.venuarrOrg = res.data;

        this.rest.venuArrHome = res.data;
      } else {
        this.rest.presentToast(res.message);
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
}
