import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

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

  eventarr: any = "";
  filtertype: any = "no";
  constructor(public router: Router, public rest: RestService) {}
  ngOnInit() {}
  tab1Click() {
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.router.navigate(["noti"]);
  }

  goToProfile() {
    this.router.navigate(["profile"]);
  }
  segmentChanged(event: any) {
    console.log(this.segmentModel);

    console.log(event);
  }

  goToDetail(opt: any) {
    console.log(opt);
    this.rest.detail = opt;
    this.router.navigate(["venuedetail"]);
  }

  goToDetailevent(opt: any) {
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
    console.log("like---", opt);
  }
  likeout(opt: any) {
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

    this.rest.events_saved(ss).subscribe((res: any) => {
      console.log("events---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.eventarr = res.data;
      } else {
        this.rest.presentToast(res.message);
      }
    });

    this.rest.venues_saved(ss).subscribe((res: any) => {
      console.log("venues---", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.venuarr = res.data;
        this.venuarrOrg = res.data;
      } else {
        this.rest.presentToast(res.message);
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
  }
}
