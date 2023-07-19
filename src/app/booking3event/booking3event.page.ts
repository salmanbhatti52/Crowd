import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
@Component({
  selector: "app-booking3event",
  templateUrl: "./booking3event.page.html",
  styleUrls: ["./booking3event.page.scss"],
})
export class Booking3eventPage implements OnInit {
  userdata: any = "";
  visitorArr: any = "";
  selectedEvent: any = "";
  prePayPercentage: any;
  prePayAmount = 0;
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform
  ) {}

  ionViewWillEnter() {
    this.selectedEvent = this.rest.detail;
    this.prePayPercentage = this.selectedEvent.booking_percentage
    this.rest.billDetails.total_bill = this.rest.billDetails.total_bill + 5;
    this.prePayAmount = this.rest.billDetails.total_bill/100 * this.prePayPercentage;
    console.log("pre_pay_amount", this.prePayAmount);

    let prePayAmountInString = this.prePayAmount.toString();
    prePayAmountInString = Number.parseFloat(prePayAmountInString).toFixed(2);
    
    this.rest.billDetails.pre_pay_amount = prePayAmountInString;
    this.rest.billDetails.remaining_amount = this.rest.billDetails.total_bill - this.prePayAmount;

  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }

  async cancelBooking() {
    console.log("model");
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });

    await modal.present();
  }

  goToChat() {
    this.router.navigate(["chat"]);
  }

  openBrowserLink() {
    console.log("opennnnn");

    this.iab.create(this.selectedEvent.website, "_blank");
  }

  public goLocation() {
    // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    var geocoords =
      this.selectedEvent.lattitude + "," + this.selectedEvent.longitude;

    if (this.platform.is("ios")) {
      window.open("maps://?q=" + geocoords, "_system");
    } else {
      var label = encodeURI(this.selectedEvent.location); // encode the label!
      window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");

      // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    }
  }

  buyTicket() {
    console.log("buy");
  }

  getTime(val:any){
    if(val){
      return val.substring(0,5);
    }
  }

  goToNext() {
    this.router.navigate(["paymentmethod"]);
  }
}
