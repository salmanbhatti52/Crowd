import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { RestService } from "../rest.service";

@Component({
  selector: "app-venuedetail",
  templateUrl: "./venuedetail.page.html",
  styleUrls: ["./venuedetail.page.scss"],
})
export class VenuedetailPage implements OnInit {
  detailObj: any = "";
  displaydiv = false;
  num = 0;

  constructor(
    public router: Router,
    public location: Location,
    public rest: RestService,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.detailObj = this.rest.detail;
    console.log("detaill----", this.detailObj);
  }

  goBack() {
    this.location.back();
  }

  goToProfile() {
    this.router.navigate(["profile"]);
  }

  claimDrag() {
    this.num++;
    console.log("dragggggg---", this.num);
    if (this.num >= 30) {
      this.displaydiv = true;
      this.num = 0;
    }
    console.log("dragggggg---44444", this.num);
  }

  public goLocation() {
    // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    var geocoords = this.detailObj.lat + "," + this.detailObj.long;

    if (this.platform.is("ios")) {
      window.open("maps://?q=" + geocoords, "_system");
    } else {
      var label = encodeURI(this.detailObj.location); // encode the label!
      window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");

      // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    }
  }

  goWeb() {
    console.log("dragggggg");
  }

  goCall() {
    console.log("dragggggg");
  }

  dismiss() {
    this.displaydiv = false;
    console.log("dragggggg");
  }
}
