import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parse } from "date-fns";
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
  discountedAmount: any;
  discountPercentage: any;
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform
  ) {}

  ionViewWillEnter() {
    this.rest.discountPercentage = undefined;
    this.rest.discountedAmount = undefined;
    
    console.log("comingFrom: ",this.rest.comingFrom);
    if(this.rest.comingFrom == 'booking2event'){
      this.selectedEvent = this.rest.detail;
      console.log(this.selectedEvent);
      
      this.prePayPercentage = this.selectedEvent.booking_percentage
      this.rest.billDetails.total_bill = this.rest.billDetails.total_bill + 5;
      
      if(this.rest.claimDiscount == true){
        let totalBillBefore = this.rest.billDetails.total_bill;
        console.log("Total Bill Before:",totalBillBefore);
        
        this.discountedAmount = this.rest.billDetails.total_bill/100 * this.selectedEvent.discount_percentage;
        this.discountPercentage = Number.parseFloat(this.selectedEvent.discount_percentage); 
        this.discountedAmount = Number.parseFloat(this.discountedAmount).toFixed(2);
        this.rest.discountedAmount = this.discountedAmount;
        this.rest.discountPercentage = this.discountPercentage;
        console.log("discountedAmount: ",this.discountedAmount);
  
        this.rest.billDetails.total_bill = this.rest.billDetails.total_bill - this.discountedAmount;
        this.rest.billDetails.total_bill = Number.parseFloat(this.rest.billDetails.total_bill).toFixed(2);
        console.log("Total Bill After Discount Applied", this.rest.billDetails.total_bill);
      }
      
      this.prePayAmount = this.rest.billDetails.total_bill/100 * this.prePayPercentage;
      // console.log("pre_pay_amount", this.prePayAmount);
      
      let prePayAmountInString = this.prePayAmount.toString();
      prePayAmountInString = Number.parseFloat(prePayAmountInString).toFixed(2);
      
      this.rest.billDetails.pre_pay_amount = prePayAmountInString;
      let remaining_amount = this.rest.billDetails.total_bill - this.prePayAmount;
      
      this.rest.billDetails.remaining_amount = Number.parseFloat(remaining_amount.toString()).toFixed(2);
    }
    // console.log("pre_pay_amount", this.prePayAmount);

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
       val = parse(val, 'HH:mm:ss', new Date());
       return val = format(val, 'h:mma');
    }
    else{
      return val;
    }
  }
  

  getDate(val:any){
    if(val){
      return format(new Date(val), 'E, do MMM');
    }
    else{
      return val;
    }
  }

  goToNext() {
    this.rest.comingFrom = '';
    this.router.navigate(["paymentmethod"]);
  }
}
