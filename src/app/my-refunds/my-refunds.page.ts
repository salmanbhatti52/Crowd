import { Component, OnInit } from '@angular/core';
import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
// import * as moment from "moment";
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-my-refunds',
  templateUrl: './my-refunds.page.html',
  styleUrls: ['./my-refunds.page.scss'],
})
export class MyRefundsPage implements OnInit {
  segmentModel = "inProcess";

  inProgressArr: any = [];
  orderd_inProgressArr: any = [];
  refundedArr: any = [];
  orderd_refundedArr: any =[];
  // transactionsArr:any = []
  userdata: any = "";
  userID: any = "";
  constructor(
    public location: Location,
    public modalCtrl: ModalController,
    public rest: RestService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.rest.presentLoader();
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
    console.log("user id:", this.userID);
    
    var ss = {
      users_customers_id: this.userID,
      lattitude: localStorage.getItem("longitude"),
      longitude: localStorage.getItem("lattitude"),
    };

    this.rest.sendRequest("pending_requests",ss).subscribe((res: any) => {
      console.log("inProgressArr resss------", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.inProgressArr = res.data;
        for(let i= this.inProgressArr.length-1, j=0; i>=0; i--){
          this.orderd_inProgressArr[j] = this.inProgressArr[i];
          j++;        
        }
        console.log("orderd_inProgressArr: ",this.orderd_inProgressArr);
        
      }
    });

    this.rest.sendRequest("refunded_requests",ss).subscribe((res: any) => {
      console.log("refundedArr ressssss------", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.refundedArr = res.data;
        for(let i= this.refundedArr.length-1, j=0; i>=0; i--){
          this.orderd_refundedArr[j] = this.refundedArr[i];
          j++;        
        }
        console.log("orderd_refundedArr: ",this.orderd_refundedArr);
        
      }
    });

    // this.rest.bookings_previous(ss).subscribe((res: any) => {
    //   console.log("bookings_previous------", res);
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

  // getTime(val:any){
  //   if(val){
  //     return val.substring(0,5);
  //   }
  // }
  gotoBookingDetails(data:any){
    // console.log('this.rest.selectedBooking: ',this.rest.selectedBooking);
    // console.log(data);
    this.rest.selectedBooking = data;
    this.rest.selectedBooking.coming_from = 'reservations'; 
    this.rest.detail = this.rest.selectedBooking.venues_details;
    console.log('this.rest.selectedBooking: ',this.rest.selectedBooking);
    this.router.navigate(['/booking2']);
  }

 
  goBack() {
    this.location.back();
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
  getTime(aa:any){
    return aa.substring(0,5);
  }

  editbooking(aa: any) {
    this.rest.selectedBooking = aa;
    this.router.navigate(["editbooking"]);
  }
}
