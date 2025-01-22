import { Component, OnInit } from '@angular/core';
import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
// import * as moment from "moment";
import { format, parse, parseISO } from 'date-fns';
@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.page.html',
  styleUrls: ['./my-reviews.page.scss'],
})
export class MyReviewsPage implements OnInit {

  segmentModel = "reviewed";

  // inProgressArr: any = [];
  // orderd_inProgressArr: any = [];
  // refundedArr: any = [];
  // orderd_refundedArr: any =[];
  // transactionsArr:any = []

  previousArr: any = [];
  reviews: any = [];
  orderd_previousArr: any =[];
  userdata: any = "";
  userID: any = "";
  unratedVenues: any = [];
  constructor(
    public location: Location,
    public modalCtrl: ModalController,
    public rest: RestService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.segmentModel = 'reviewed';
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
    console.log("user id:", this.userID);
    this.getUnratedVenues();
    this.getUserReviews(); 

  }
  
  segmentChanged(event: any) {
    console.log(this.segmentModel);
    console.log("eee", event);
  }

  getUserReviews(){
    let data = {
      users_customers_id:this.userID,  
      // venues_id:"53"
    }
    this.rest.presentLoader();
    this.rest.sendRequest('get_user_reviews',data ).subscribe((res: any)=>{
      console.log(res);
      this.rest.dismissLoader();
      if(res.status == 'success'){
        this.reviews = res.data;
        // for(let rev of this.reviews){
        //   rev.review_ratings = '4.5'
        // }
      }
      
    });
  }

  getReviewdVenues(){
    // if(this.orderd_inProgressArr.length == 0){
    //   this.rest.presentLoader();
    // }
    // var ss = {
    //   users_customers_id: this.userID,
    //   lattitude: localStorage.getItem("longitude"),
    //   longitude: localStorage.getItem("lattitude"),
    // };

    // this.rest.sendRequest("pending_requests",ss).subscribe((res: any) => {
    //   console.log("inProgressArr resss------", res);
    //   if(this.orderd_inProgressArr.length == 0){
    //     this.rest.dismissLoader();
    //   }
    //   if (res.status == "success") {
    //     this.inProgressArr = res.data;
    //     for(let i= this.inProgressArr.length-1, j=0; i>=0; i--){
    //       this.orderd_inProgressArr[j] = this.inProgressArr[i];
    //       j++;        
    //     }
    //     console.log("orderd_inProgressArr: ",this.orderd_inProgressArr);
        
    //   }
    // });
  }

  getUnratedVenues(){
    // if(this.orderd_refundedArr.length == 0){
    //   this.rest.presentLoader();
    // }
    var ss = {
      users_customers_id: this.userID,
    };

    this.rest.sendRequest("get_unrated_venues",ss).subscribe((res: any) => {
      console.log("refundedArr ressssss------", res);
      if (res.status == "success") {
        this.unratedVenues = res.data;
      }
    });
  }

 
  goBack() {
    // this.location.back();
    this.router.navigate(['/profile']);
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

  getDateSlashFormat(val:any){
    if(val){
      return format(new Date(val), 'M/d/yyyy');
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

  goForAddReview(venue:any){
    this.router.navigate(['/add-review'],{queryParams:{venueId:venue.venues_id,venueName:venue.venues_details.name}});
  }
  


  getPreviousBookings(){
    if(this.orderd_previousArr.length == 0){
      this.rest.presentLoader();
    }
    var ss = JSON.stringify({
      users_customers_id: this.userID,
    });

    this.rest.bookings_previous(ss).subscribe((res: any) => {
      console.log("bookings_previous------", res);
      if(this.orderd_previousArr.length == 0){
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.previousArr = res.data;
        for(let i= this.previousArr.length-1, j=0; i>=0; i--){
          this.orderd_previousArr[j] = this.previousArr[i];
          j++;        
        }
        console.log("orderd_previousArr: ",this.orderd_previousArr);
      }
    });
  }


}
