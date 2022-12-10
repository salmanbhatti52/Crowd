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

  eventarr: any = "";
  constructor(public router: Router, public rest: RestService) {}
  ngOnInit() {
    //this.rest.presentLoader();
    var ss = JSON.stringify({
      // longitude: localStorage.getItem("longitude"),
      // lattitude: localStorage.getItem("lattitude"),
      users_customers_id: "1",
      longitude: "71.513317",
      lattitude: "30.204700",
    });

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
      } else {
        this.rest.presentToast(res.message);
      }
    });
  }
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

  showHideFilter() {
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
}
