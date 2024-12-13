import { Component, OnInit } from '@angular/core';
import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
// import * as moment from "moment";
import { format, parse, parseISO } from 'date-fns';

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
    this.segmentModel = 'inProcess';
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
    console.log("user id:", this.userID);
    this.getPendingRequests();
  }
  
  segmentChanged(event: any) {
    console.log(this.segmentModel);
    console.log("eee", event);
  }

  getPendingRequests(){
    if(this.orderd_inProgressArr.length == 0){
      this.rest.presentLoader();
    }
    var ss = {
      users_customers_id: this.userID,
      lattitude: localStorage.getItem("longitude"),
      longitude: localStorage.getItem("lattitude"),
    };

    this.rest.sendRequest("pending_requests",ss).subscribe((res: any) => {
      console.log("inProgressArr resss------", res);
      if(this.orderd_inProgressArr.length == 0){
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.inProgressArr = res.data;
        for(let i= this.inProgressArr.length-1, j=0; i>=0; i--){
          this.orderd_inProgressArr[j] = this.inProgressArr[i];
          j++;        
        }
        console.log("orderd_inProgressArr: ",this.orderd_inProgressArr);
        
      }
    });
  }

  getRefundedRequests(){
    if(this.orderd_refundedArr.length == 0){
      this.rest.presentLoader();
    }
    var ss = {
      users_customers_id: this.userID,
      lattitude: localStorage.getItem("longitude"),
      longitude: localStorage.getItem("lattitude"),
    };

    this.rest.sendRequest("refunded_requests",ss).subscribe((res: any) => {
      console.log("refundedArr ressssss------", res);
      if(this.orderd_refundedArr.length == 0){
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.refundedArr = res.data;
        for(let i= this.refundedArr.length-1, j=0; i>=0; i--){
          this.orderd_refundedArr[j] = this.refundedArr[i];
          j++;        
        }
        console.log("orderd_refundedArr: ",this.orderd_refundedArr);
        
      }
    });
  }

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
    // this.location.back();
    this.router.navigate(['/profile']);
  }



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

  showTickets(aa:any){
    console.log("aa: ",aa);
    this.rest.ticketsData = aa;
    this.rest.ticketTokens = aa.events_tickets;
    this.router.navigate(['show-tickets']);
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
      return format(new Date(val), 'E, dd MMM');
    }
    else{
      return val;
    }
  }
  
  getDateSlashFormat(val:any){
    if(val){
      return format(new Date(val), 'M/d/yyyy');
    }
    else{
      return val;
    }
  }

  editbooking(aa: any) {
    this.rest.selectedBooking = aa;
    this.router.navigate(["editbooking"]);
  }
}
