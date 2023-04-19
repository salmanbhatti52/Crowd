import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parseISO } from 'date-fns';
import { log } from "console";
@Component({
  selector: "app-addcard",
  templateUrl: "./addcard.page.html",
  styleUrls: ["./addcard.page.scss"],
})
export class AddcardPage implements OnInit {
  date: any;
  minDate = format(parseISO(new Date().toISOString()),'yyyy-MM-dd');
  userdata: any = "";
  visitorArr: any = "";
  selectedVenue: any = "";
  userName: any;
  cvc: any;
  cardNumber: any;
  expiryDate = 'Expire Date';
  month: any;
  year: any;
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform,
  ) {}

  ionViewWillEnter() {
    this.selectedVenue = this.rest.detail;
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  formattedString(value:any){

    const formattedString = format(parseISO(value), 'dd MMM, yyyy');
    // =====dashed date for summary page=====
    const dashedDate = format(parseISO(value), 'dd-MM-yyyy');
    this.date = dashedDate;
    console.log(dashedDate);
    // ============done================
    // this.date=formattedString;
    // console.log(this.date);
    
    this.month = this.date.substring(3,5)
      this.year = this.date.substring(6,10)

      this.expiryDate = `${this.month}/${this.year}`;
      console.log(this.expiryDate);
      this.modalCtrl.dismiss();
    // return this.modalCtrl.dismiss(dashedDate, 'expiry_date');
  }
  cancel(ev:any){
    this.modalCtrl.dismiss();
    // this.modalCtrl.dismiss(null, 'cancel');
  }
  getUserName(ev:any){
    // console.log(ev);
    
    this.userName = ev.detail.value;
    console.log("username:",this.userName);
    
  }

  getCvc(ev:any){
    // console.log(ev);
    
    this.cvc = ev.detail.value;
    console.log("cvc:",this.cvc);
  }

  checkCardType(ev:any){
    // console.log(ev);
    this.cardNumber = ev.detail.value
    console.log("Card Number:",this.cardNumber);
    // console.log("checkCarType Called");
    // let _this = this;
    
    // var cleave = new Cleave('.input-element', {
      
    //   creditCard: true,
    //   onCreditCardTypeChanged: function (type) {
    //     // update UI ...
    //     _this.card_type = type
    //     // console.log("card_type: ",_this.card_type);
        
    //   }
    // });
    // console.log("Cleave: ",cleave);
    
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

  buyTicket() {
    console.log("buy");
  }

  goToNext() {
    this.router.navigate(["paymentmethod"]);
  }
}
