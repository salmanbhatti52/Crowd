import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonItemSliding, Platform } from "@ionic/angular";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";

@Component({
  selector: "app-venuedetail",
  templateUrl: "./venuedetail.page.html",
  styleUrls: ["./venuedetail.page.scss"],
})
export class VenuedetailPage implements OnInit {
  detailObj: any = "";
  displaydiv = false;
  num = 0;

  userdata: any = "";
  userID: any = "";

  constructor(
    public router: Router,
    public location: Location,
    public rest: RestService,
    public platform: Platform,
    public iab: InAppBrowser
  ) {}

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    this.userID = JSON.parse(this.userdata).users_customers_id;
  }

  ngOnInit() {
    this.detailObj = this.rest.detail;
    console.log("detaill----", this.detailObj);

    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.updatevVisitor();
  }

  goBack() {
    this.location.back();
  }

  goToProfile() {
    this.router.navigate(["profile"]);
  }

  claimDrag(slidingItem: IonItemSliding, event: any) {
    let ratio = event.detail.ratio;

    if (ratio == -1) {
      this.displaydiv = true;
      this.num = 0;
      console.log("if---if", ratio);

      this.claimDiscount();
    }

    console.log("dragggggg---44444", ratio);
  }

  claimDiscount() {
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: this.detailObj.venues_id,
    });

    console.log("ss claim discount-----", ss);

    this.rest.claim_discount(ss).subscribe((res: any) => {
      console.log("res claim discount-----", res);
    });
  }

  updatevVisitor() {
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: this.detailObj.venues_id,
    });

    console.log("ss updatevVisitor-----", ss);

    this.rest.update_visitors(ss).subscribe((res: any) => {
      console.log("res updatevVisitor-----", res);
    });
  }

  public goLocation() {
    // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    var geocoords = this.detailObj.lattitude + "," + this.detailObj.longitude;

    if (this.platform.is("ios")) {
      window.open("maps://?q=" + geocoords, "_system");
    } else {
      var label = encodeURI(this.detailObj.location); // encode the label!
      window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");

      // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    }
  }

  goWeb() {
    console.log("dragggggg", this.detailObj.website);
    const browser = this.iab.create(this.detailObj.website);
  }

  goCall() {
    console.log("dragggggg");
  }

  dismiss() {
    this.displaydiv = false;
    console.log("dragggggg");
  }

  closeslide(slidingItem: IonItemSliding) {
    this.dismiss();
    this.num = 0;
    slidingItem.close();
  }

  openSlider(slidingItem: IonItemSliding) {
    console.log("opne");

    this.num = 0;
    slidingItem.close();
    console.log("else---else", this.num);
  }

  likevenu() {
    console.log("likevenu", this.detailObj);

    if (this.detailObj.likes == 0) {
      this.detailObj.likes = 1;
      this.likeDislikeUServenu(this.detailObj.venues_id);
    }
  }
  likeoutvenu() {
    console.log("likeoutvenu", this.detailObj);

    if (this.detailObj.likes == 1) {
      this.detailObj.likes = 0;
      this.likeDislikeUServenu(this.detailObj.venues_id);
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

  goToSee() {
    this.router.navigate(["seepeople"]);
  }

  bookTable() {
    console.log("hell");

    this.router.navigate(["booking1"]);
  }
}
