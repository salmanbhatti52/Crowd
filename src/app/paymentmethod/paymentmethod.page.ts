import { PaymentsuccessPage } from "./../paymentsuccess/paymentsuccess.page";
import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";

@Component({
  selector: "app-paymentmethod",
  templateUrl: "./paymentmethod.page.html",
  styleUrls: ["./paymentmethod.page.scss"],
})
export class PaymentmethodPage implements OnInit {
  userdata: any = "";
  visitorArr: any = "";
  selectedVenue: any = "";
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform
  ) {}

  ionViewWillEnter() {
    this.selectedVenue = this.rest.detail;
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

  async paynow() {
    console.log("model");
    const modal = await this.modalCtrl.create({
      component: PaymentsuccessPage,
      cssClass: "riz",
    });

    await modal.present();
    this.router.navigate(['/ticket']);
  }

  buyTicket() {
    console.log("buy");
  }

  goToNext() {
    this.router.navigate(["paymentmethod"]);
  }
  addcard() {
    this.router.navigate(["addcard"]);
  }
}
