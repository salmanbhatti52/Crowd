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
  // item = {
  //   price: 100.00
  // };
  // paymentRequest!: google.payments.api.PaymentDataRequest;
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

  ngOnInit() {
    // this.paymentRequest = {
    //   apiVersion: 2,
    //   apiVersionMinor: 0,
    //   allowedPaymentMethods: [
    //     {
    //       type: 'CARD',
    //       parameters: {
    //         allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    //         allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
    //       },
    //       tokenizationSpecification: {
    //         type: 'PAYMENT_GATEWAY',
    //         parameters: {
    //           gateway: 'example',
    //           gatewayMerchantId: 'exampleGatewayMerchantId'
    //         }
    //       }
    //     }
    //   ],
    //   merchantInfo: {
    //     merchantId: '12345678901234567890',
    //     merchantName: 'Demo Merchant (You will not be charged)'
    //   },
    //   transactionInfo: {
    //     totalPriceStatus: 'FINAL',
    //     totalPriceLabel: 'Total',
    //     totalPrice: this.item.price.toFixed(2),
    //     currencyCode: 'USD',
    //     countryCode: 'US'
    //   }
    // }
  }

  // async onLoadPaymentData(event:Event){
  //   const paymentData = (event as CustomEvent<google.payments.api.PaymentData>).detail;
  //   // await this.storeService.processOrder(
  //   //   [
  //   //     {
  //   //       item: this.item,
  //   //       quantity: this.quantity,
  //   //       size: this.size,
  //   //     },
  //   //   ],
  //   //   paymentData,
  //   // );

  //   console.log("paymentData: ",paymentData);
    

  // }

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

  // ========================Google Pay===================

  //==========================done=========================
}
