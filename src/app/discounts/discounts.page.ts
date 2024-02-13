import { Component, OnInit } from '@angular/core';
import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { IonItemSliding, Platform } from "@ionic/angular";
// import * as moment from "moment";
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.page.html',
  styleUrls: ['./discounts.page.scss'],
})
export class DiscountsPage implements OnInit {

  segmentModel = "Special Offers";

  specialOffersArr: any = [];
  orderd_specialOffersArr: any = [];
  claimedVenuesArr: any = [];
  orderd_claimedVenuesArr: any =[];
  inQueueVenuesArr: any = [];
  orderd_inQueueVenuesArr: any =[];
  
  displaydiv = false;
  discountToken:any;
  userdata: any = "";
  userID: any = "";
  hideClaimDiscountButton: boolean = false;
  detailObj: any = "";
  constructor(
    public location: Location,
    public modalCtrl: ModalController,
    public rest: RestService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  claimDrag(slidingItem: IonItemSliding, event: any, selectedVenue: any) {
    this.detailObj = selectedVenue;
    let ratio = event.detail.ratio;

    if (ratio == -1) {
      
      // this.num = 0;
      console.log("if---if", ratio);
      
      this.claimDiscount(selectedVenue);
    }

    console.log("dragggggg---44444", ratio);
  }

  claimDiscount(venue:any) {
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: venue.venues_id,
    });

    console.log("ss claim discount-----", ss);
    this.rest.presentLoader();
    this.rest.claim_discount(ss).subscribe((res: any) => {
      this.rest.dismissLoader();
      console.log("res claim discount-----", res);
      if(res.status == 'success'){
        this.discountToken = res.data[0].claimed_token;
        this.displaydiv = true;
        // this.rest.claimedVenDiscount = true;
        venue.remaining_time = '23:59:59';
        this.hideClaimDiscountButton = true;
        // this.setClaimedVenueRemTime(res.data[0].claimed_date);
      }
    });
  }
  openSlider(slidingItem: IonItemSliding) {
    console.log("opnessssssssssssssssss");

    // this.num = 0;
    slidingItem.close();
    // console.log("else---else", this.num);
  }

  // closeslide(slidingItem: IonItemSliding) {
  //   this.dismiss();
  //   // this.num = 0;
  //   slidingItem.close();
  // }

  dismiss() {
    this.displaydiv = false;
    console.log("dragggggg");
  }


  ionViewWillEnter() {
    
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    var ss = {
      users_customers_id: this.userID,
      lattitude: localStorage.getItem("longitude"),
      longitude: localStorage.getItem("lattitude"),
    };
    this.rest.presentLoader();
    this.rest.sendRequest("special_offers",ss).subscribe((res: any) => {
      console.log("special_offers------", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.specialOffersArr = res.data;
        // for(let i= this.specialOffersArr.length-1, j=0; i>=0; i--){
        //   this.orderd_specialOffersArr[j] = this.specialOffersArr[i];
        //   j++;        
        // }
        // console.log("orderd_upcomingArr: ",this.orderd_specialOffersArr);
        
      }
    });

    // this.rest.sendRequest("get_previous_events_list",ss).subscribe((res: any) => {
    //   console.log("get_previous_events_list------", res);
    //   this.rest.dismissLoader();
    //   if (res.status == "success") {
    //     this.previousArr = res.data;
    //     for(let i= this.previousArr.length-1, j=0; i>=0; i--){
    //       this.orderd_previousArr[j] = this.previousArr[i];
    //       j++;        
    //     }
    //     console.log("orderd_previousArr: ",this.orderd_previousArr);
    //   }
    // });
  }

  gotoEventDetails(data:any){
    this.rest.detail = data;
    console.log('this.rest.detail: ',this.rest.detail);
    
    this.router.navigate(['/event-detail']);
  }

 
  goBack() {
    this.router.navigate(['/profile']);
  }

  handleRefresh(ev: any) {}

  async cancelBooking(aa: any) {
    this.rest.selectedBooking = aa;
    console.log("model");
    this.rest.comingFrom = "myreservation";
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });
    modal.onDidDismiss().then((data) => {
      console.log("aaaaaaaaaaaaaa");
      this.ionViewWillEnter();

      const user = data["data"]; // Here's your selected user!
    });

    await modal.present();
  }

  getDate(aa: any) {
    return format(parseISO(new Date(aa).toISOString()) ,"MMM dd yyyy");
  }
  getTime(val:any){
    if(val){
      return val.substring(0,5);
    }
  }

  editbooking(aa: any) {
    this.rest.selectedBooking = aa;
    this.router.navigate(["editbooking"]);
  }

}
