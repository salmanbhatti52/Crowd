import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonItemSliding, Platform } from "@ionic/angular";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { eachMinuteOfInterval, getDate, getDay } from "date-fns";

@Component({
  selector: "app-venuedetail",
  templateUrl: "./venuedetail.page.html",
  styleUrls: ["./venuedetail.page.scss"],
})
export class VenuedetailPage implements OnInit {
  detailObj: any = "";
  displaydiv = false;
  // num = 0;

  rateStar1 = false;
  rateStar2 = false;
  rateStar3 = false;
  rateStar4 = false;
  rateStar5 = false;

  ratingValue:any = 0.0;

  userdata: any = "";
  userID: any = "";
  discountToken:any;
  hideClaimDiscountButton: boolean = false;
  reviews:any = [];
  constructor(
    public router: Router,
    public location: Location,
    public rest: RestService,
    public platform: Platform,
    public iab: InAppBrowser
  ) {}

  ionViewWillEnter() {
    if(this.rest.comingFrom == 'home'){
      this.rest.claimedVenDiscount = false;
    }
    
    this.rest.comingFrom = '';
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    this.userID = JSON.parse(this.userdata).users_customers_id;
    this.ratingValue = this.ratingValue.toFixed(1);
    this.updatevVisitor();
    this.getVenueReviews();
  }

  getVenueReviews(){
    let data = {
      users_customers_id:this.userID,  
      venues_id:this.detailObj.venues_id
    }
    this.rest.presentLoader();
    this.rest.sendRequest('get_reviews',data ).subscribe((res: any)=>{
      this.rest.dismissLoader();
      console.log(res);
      if(res.status == 'success'){
        this.reviews = res.data;
      }
      
    });
  }


  showAllReviews(){
    this.router.navigate(['/reviews'],{queryParams: {venueId: this.detailObj.venues_id, userId: this.userID}});
  }

  goForAddReview(){
    this.router.navigate(['/add-review'],{queryParams:{venueId:this.detailObj.venues_id}});
  }

  ngOnInit() {
    this.detailObj = this.rest.detail;
    console.log("detaill----", this.detailObj);
    console.log("discountPercentage: ",this.detailObj.discount_percentage);
    
    let dayNumber = getDay(new Date());
    console.log(dayNumber);
    this.detailObj.start_hours = this.detailObj.venue_timing[dayNumber].start_hours;
    this.detailObj.close_hours = this.detailObj.venue_timing[dayNumber].close_hours;
    console.log("claimedVenues: ",this.rest.claimedVenues);
    if(this.detailObj.discount_percentage > 0 ){
      for(let venue of this.rest.claimedVenues){
        console.log("venue.venues_id: ",venue.venues_id);
        console.log("this.detailObj.venues_id: ",this.detailObj.venues_id);
        
        if(venue.venues_id == this.detailObj.venues_id){
          console.log(venue);
          this.detailObj.remaining_time = venue.remaining_time;
          console.log(this.detailObj.remaining_time);
          // break;
          // this.rest.claimedVenDiscount = true;
          // this.rest.discountPercentage = venue.discount_percentage;
          // this.rest.discountedAmount = venue.discounted_amount;
          // this.rest.claimedVenues = [];
        }
      }
      // console.log("this.rest.claimedVenDiscount: ",this.rest.claimedVenDiscount);
      // console.log("detaill 2----", this.detailObj);
      
    }
    if(this.detailObj.discount_percentage <= 0 ){
      this.hideClaimDiscountButton = true;
    }else if(this.detailObj.remaining_time != null){
      this.hideClaimDiscountButton = true;
    }else{
      this.hideClaimDiscountButton = false;
    }


    
    // this.userdata = localStorage.getItem("userdata");
    // console.log("userdata----", this.userdata);
    // this.userID = JSON.parse(this.userdata).users_customers_id;

    
  }

  getTime(val:any){
    
    return val.substring(0,5);
  }

  goBack() {
    this.rest.venueDiscountToken = undefined;
    this.discountToken = undefined;
    this.location.back();
  }

  goToProfile() {
    this.router.navigate(["profile"]);
  }

  claimDrag(slidingItem: IonItemSliding, event: any) {
    let ratio = event.detail.ratio;

    if (ratio == -1) {
      
      // this.num = 0;
      console.log("if---if", ratio);
      
      this.claimDiscount();
    }

    console.log("dragggggg---44444", ratio);
  }

  claimDiscount() {
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: this.detailObj.venues_id,
    });

    console.log("ss claim discount-----", ss);
    this.rest.presentLoader();
    this.rest.claim_discount(ss).subscribe((res: any) => {
      this.rest.dismissLoader();
      console.log("res claim discount-----", res);
      if(res.status == 'success'){
        this.discountToken = res.data[0].claimed_token;
        this.rest.venueDiscountToken = this.discountToken;
        this.displaydiv = true;
        // this.rest.claimedVenDiscount = true;
        this.detailObj.remaining_time = '23:59:59';
        this.hideClaimDiscountButton = true;
        // this.setClaimedVenueRemTime(res.data[0].claimed_date);
      }
    });
  }

  // setClaimedVenueRemTime(claimed_date: any) {
  //   let hours = 23;
  //   let minutes = 59;
  //   let seconds = 59;
  //   let totalMinutes = 0;
  //   // if(this.claimedVenues.length){
  //     // for(let venue of this.claimedVenues){
  //       const resultMinutes = eachMinuteOfInterval({
  //         start: new Date(claimed_date),
  //         end: new Date()
  //       });
  //       totalMinutes = resultMinutes.length;
  //       // console.log(totalMinutes);
  //       hours = Math.floor(totalMinutes / 60) ;
  //       minutes = totalMinutes % 60;
  //       seconds = 0;
  //       // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
  //       if(hours <= 23){
  //         hours = 23 - hours;
  //         minutes = 59 - minutes;
  //         seconds = 59 - seconds;
  //         venue.remaining_time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
  //       }else{
  //         venue.remaining_time = null;
  //       }
       
        
  //       // console.log(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`);
  //     // }
  //     // this.rest.claimedVenues = this.claimedVenues;
  //   // }
  // }

  updatevVisitor() {
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: this.detailObj.venues_id,
    });

    console.log("ss updatevVisitor-----", ss);

    this.rest.update_visitors(ss).subscribe((res: any) => {
      console.log("res updatevVisitor-----", res);
    });
  }

  public goLocation() {
    // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    var geocoords = this.detailObj.lattitude + "," + this.detailObj.longitude;

    if (this.platform.is("ios")) {
      window.open("maps://?q=" + geocoords, "_system");
    } else {
      var label = encodeURI(this.detailObj.location); // encode the label!
      console.log("labellll: ",label);
      
      window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");

      // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    }
  }

  goWeb() {
    console.log("dragggggg", this.detailObj.website);
    const browser = this.iab.create(this.detailObj.website);
  }

  goCall() {
    console.log("dragggggg");
  }

  dismiss() {
    this.displaydiv = false;
    console.log("dragggggg");
  }

  closeslide(slidingItem: IonItemSliding) {
    this.dismiss();
    // this.num = 0;
    slidingItem.close();
  }

  openSlider(slidingItem: IonItemSliding) {
    console.log("opnessssssssssssssssss");

    // this.num = 0;
    slidingItem.close();
    // console.log("else---else", this.num);
  }

  likevenu() {
    console.log("likevenu", this.detailObj);

    if (this.detailObj.likes == 0) {
      this.detailObj.likes = 1;
      this.likeDislikeUServenu(this.detailObj.venues_id);
    }
  }
  likeoutvenu() {
    console.log("likeoutvenu", this.detailObj);

    if (this.detailObj.likes == 1) {
      this.detailObj.likes = 0;
      this.likeDislikeUServenu(this.detailObj.venues_id);
    }
  }

  likeDislikeUServenu(events_id: any) {
    console.log(events_id);
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: events_id,
    });

    console.log(ss);
    this.rest.venues_like_unlike(ss).subscribe((res: any) => {
      console.log(res);
    });
  }

  goToSee() {
    this.router.navigate(["seepeople"]);
  }

  bookTable() {
    console.log("hell");

    this.router.navigate(["booking1"]);
  }
}
