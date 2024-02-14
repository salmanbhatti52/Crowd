import { Component, OnInit } from '@angular/core';
import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { IonItemSliding, Platform } from "@ionic/angular";
// import * as moment from "moment";
import { eachMinuteOfInterval, format, parseISO } from 'date-fns';

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
  
  claimedVenues: any = [];
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

  getClaimedVenues(){
    let data = {
      "users_customers_id":this.userID
    };
    this.rest.sendRequest('get_claimed_venues',data ).subscribe((res: any)=>{
    console.log("get_claimed_venues",res);
    if(res.status == 'success'){
      this.claimedVenues = res.data;
      this.setClaimedVenueRemTime();
    }
      
    });
  }

  setClaimedVenueRemTime(){
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    let totalMinutes = 0;

    if(this.claimedVenues.length){
      for(let venue of this.claimedVenues){
        const resultMinutes = eachMinuteOfInterval({
          start: new Date(venue.claimed_date),
          end: new Date()
        });
        totalMinutes = resultMinutes.length;
        // console.log(totalMinutes);
        hours = Math.floor(totalMinutes / 60) ;
        minutes = totalMinutes % 60;
        seconds = 0;
        // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
        if(hours <= 23){
          hours = 23 - hours;
          minutes = 59 - minutes;
          seconds = 59 - seconds;
          venue.remaining_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        }else{
          venue.remaining_time = null;
          // this.claimedVenues.pop(venue);
        }
      }
      // for(let venue of this.claimedVenues){
      //   if(venue.remaining_time == null){
      //     this.claimedVenues.pop(venue);
      //   }
      // }
      // this.rest.claimedVenues = this.claimedVenues;
      console.log("claimed venues: ",this.claimedVenues);
      this.setVenueDiscountStatus(); 
    }
  }

  setVenueDiscountStatus(){
    let inQueueVenues: any = [];
    let specialOffers: any = [];
    let discountClaimedStatus = '';
    let foundVenue: any = "";
    
    // if(this.claimedVenues.length > 0 ) {
    //   for(let claimedVenue of this.claimedVenues){
    //     discountClaimedStatus = '';
    //     foundVenue = undefined;
        
    //     // if(claimedVenue.remaining_time != null){
    //       for(let offerVenue of this.specialOffersArr){
    //         if(claimedVenue.venues_id == offerVenue.venues_id){
    //           if(claimedVenue.remaining_time == null){
    //             // offerVenue.remaining_time = claimedVenue.remaining_time;
    //             discountClaimedStatus = 'false';
    //             offerVenue.discount_token = null;
    //             foundVenue = offerVenue;
                
    //           }else{
    //             offerVenue.remaining_time = claimedVenue.remaining_time;
    //             discountClaimedStatus = 'true';
    //             offerVenue.discount_token = claimedVenue.claimed_token;
    //             foundVenue = offerVenue;
                
    //         }
    //           // console.log(offerVenue.venues_id);
    //           // console.log(claimedVenue.venues_id);
              
    //         }
    //       }
  
    //       if(discountClaimedStatus == 'true'){
    //         inQueueVenues.push(foundVenue);
    //       }else if(discountClaimedStatus == 'false'){
    //         specialOffers.push(foundVenue);
    //       }else{
    //         // console.log(claimedVenue.venues_id);
            
    //         console.log("else---else");
    //       }
    //     // }
        
        
    //   }
    //   this.orderd_specialOffersArr = specialOffers;
    //   this.inQueueVenuesArr = inQueueVenues;

    //   console.log("inQueueVenuesArr: ",this.inQueueVenuesArr);
    //   console.log("orderd_specialOffersArr: ",this.orderd_specialOffersArr);
      
    // }

    if(this.claimedVenues.length > 0 ) {
      for(let offerVenue of this.specialOffersArr){
        discountClaimedStatus = '';
        foundVenue = undefined;
        
        // if(claimedVenue.remaining_time != null){
          for(let claimedVenue of this.claimedVenues){
            if(claimedVenue.venues_id == offerVenue.venues_id){
              if(claimedVenue.remaining_time == null){
                // offerVenue.remaining_time = claimedVenue.remaining_time;
                discountClaimedStatus = 'false';
                offerVenue.discount_token = null;
                foundVenue = offerVenue;
                
              }else{
                // offerVenue.remaining_time = claimedVenue.remaining_time;
                discountClaimedStatus = 'true';
                offerVenue.discount_token = claimedVenue.claimed_token;
                foundVenue = offerVenue;
                
            }
              // console.log(offerVenue.venues_id);
              // console.log(claimedVenue.venues_id);
              
            }
          }
  
          if(discountClaimedStatus == 'true'){
            inQueueVenues.push(foundVenue);
          }else if(discountClaimedStatus == 'false'){
            specialOffers.push(foundVenue);
          }else{
            // console.log(claimedVenue.venues_id);
            
            console.log("else---else");
          }
        // }
        
        
      }
      this.orderd_specialOffersArr = specialOffers;
      this.inQueueVenuesArr = inQueueVenues;

      console.log("inQueueVenuesArr: ",this.inQueueVenuesArr);
      console.log("orderd_specialOffersArr: ",this.orderd_specialOffersArr);
      
    }
   
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
        this.getClaimedVenues();
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
    this.rest.presentLoaderWd();
    this.rest.sendRequest("special_offers",ss).subscribe((res: any) => {
      console.log("special_offers------", res);
      
      if (res.status == "success") {
        this.specialOffersArr = res.data;
        this.getClaimedVenues();
      }
    });
  }

  

 
  goBack() {
    this.router.navigate(['/profile']);
  }

  handleRefresh(ev: any) {}

  getDate(aa: any) {
    return format(parseISO(new Date(aa).toISOString()) ,"MMM dd yyyy");
  }
  getTime(val:any){
    if(val){
      return val.substring(0,5);
    }
  }

  // closeslide(slidingItem: IonItemSliding) {
  //   this.dismiss();
  //   // this.num = 0;
  //   slidingItem.close();
  // }

  // async cancelBooking(aa: any) {
  //   this.rest.selectedBooking = aa;
  //   console.log("model");
  //   this.rest.comingFrom = "myreservation";
  //   const modal = await this.modalCtrl.create({
  //     component: CancelbookPage,
  //     cssClass: "riz",
  //   });
  //   modal.onDidDismiss().then((data) => {
  //     console.log("aaaaaaaaaaaaaa");
  //     this.ionViewWillEnter();

  //     const user = data["data"]; // Here's your selected user!
  //   });

  //   await modal.present();
  // }

 
  // gotoEventDetails(data:any){
  //   this.rest.detail = data;
  //   console.log('this.rest.detail: ',this.rest.detail);
    
  //   this.router.navigate(['/event-detail']);
  // }

  // editbooking(aa: any) {
  //   this.rest.selectedBooking = aa;
  //   this.router.navigate(["editbooking"]);
  // }

}
