import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Platform,IonItemSliding } from "@ionic/angular";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parse } from "date-fns";

@Component({
  selector: "app-eventdetail",
  templateUrl: "./eventdetail.page.html",
  styleUrls: ["./eventdetail.page.scss"],
})
export class EventdetailPage implements OnInit {
  text: string = ''; // Full content received from API
  truncatedText: string = ''; // Content truncated to 4 lines
  isTruncated: boolean = false;
  showFullText: boolean = false;

  detailObj: any = "";
  displaydiv = false;
  num = 0;

  userdata: any = "";
  userID: any = "";
  availableTickets: any;
  allTicketsSold= false;
  filteredEventTypes: any;

  constructor(
    public router: Router,
    public location: Location,
    public rest: RestService,
    public platform: Platform,
    public iab: InAppBrowser
  ) {}

  ionViewWillEnter() {
    this.rest.reviewType = 'event';
    if(this.rest.comingFrom == 'home'){
      this.rest.claimDiscount = false;
    }
    this.rest.comingFrom = '';
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.updatevVisitor();
  }

  // ======== more feature =========
    checkTruncate() {
      console.log('checkTruncate() called');
      
      const maxLength = 210; // Adjust this value as needed
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.width = '100%';
      tempElement.style.lineHeight = '1.5em'; // Set this to match your CSS
      tempElement.style.maxHeight = '6em'; // 4 lines of 1.5em
      tempElement.innerText = this.text;

      document.body.appendChild(tempElement);
      this.isTruncated = tempElement.scrollHeight > tempElement.offsetHeight;

      if (this.isTruncated) {
        console.log('Text is truncated');
        
        // Use space-based truncation to avoid cutting words
        const words = this.text.split(' ');
        let truncatedText = '';
        for (const word of words) {
          if ((truncatedText + word).length > maxLength) break;
          truncatedText += `${word} `;
        }
        this.truncatedText = truncatedText.trim() + '...'; // Add ellipsis for clarity
      }else{
        this.truncatedText = this.text;
      }

      document.body.removeChild(tempElement);
    }

    toggleText() {
      this.showFullText = !this.showFullText;
    }

  // ==============================

  ngOnInit() {
    this.detailObj = this.rest.detail;
    this.text = this.detailObj.description; // Replace with your API data
    this.checkTruncate();

    console.log("detaill----", this.detailObj);
    this.rest.booking_percentage = this.detailObj.booking_percentage;
    let currentDate = new Date();
    console.log("currentDate: ",currentDate);
    let eventDate = new Date(this.detailObj.event_date);
    console.log(" eventDate:  ",eventDate);
    this.detailObj.formatted_date = format(eventDate, 'E, do MMM');
    // console.log(this.detailObj.formatted_date);
    
    
    if(this.detailObj.event_start_time != null && this.detailObj.event_end_time != null){
      //parse date
      let start_time;
      let end_time;
      // parse in date object format
      start_time = parse(this.detailObj.event_start_time, 'HH:mm:ss', new Date());
      end_time = parse(this.detailObj.event_end_time, 'HH:mm:ss', new Date());
      // console.log('start_time: ttttttttt', parse(this.detailObj.event_end_time, 'HH:mm:ss', new Date()));
      
      //format the date
      start_time = format(start_time, 'haaa');
      end_time = format(end_time, 'haaa');
      // console.log('startTime',start_time);
      // console.log('endTime',end_time);
      this.detailObj.formatted_start_time = start_time;
      this.detailObj.formatted_end_time = end_time;
      
    }

    this.availableTickets = this.detailObj.no_of_tickets - this.detailObj.booked_tickets; 
    console.log("Available Tickets: ",this.availableTickets);
    // if(this.availableTickets < 1 || eventDate < currentDate){
    if(this.availableTickets < 1 ){
      this.allTicketsSold = true;
    }

    this.filteredEventTypes = this.detailObj.event_keywords?.filter((keyword:any) => keyword.keyword_type == "event_type" && keyword.keyword_image != null).slice(0,1);
  }

  showAllReviews(){
    this.router.navigate(['/reviews'],{queryParams: {venueId: 53, userId: this.userID, venueName:this.detailObj.venue_name}});
  }

  // =======================came from venue detail =================
  claimDrag2(slidingItem: IonItemSliding, event: any) {
    let ratio = event.detail.ratio;

    if (ratio == -1) {
      this.displaydiv = true;
      this.num = 0;
      console.log("if---if", ratio);
      this.rest.claimDiscount = true;
      // this.claimDiscount();
    }

    console.log("dragggggg---44444", ratio);
  }

  // claimDiscount() {
  //   var ss = {
  //     users_customers_id: this.userID,
  //     events_id: this.detailObj.events_id,
  //   };

  //   console.log("ss claim discount-----", ss);

  //   this.rest.sendRequest("events_claim_discount",ss).subscribe((res:any)=>{
  //     console.log("res claim discount for events-----", res);
  //   })
    
  // }

  openSlider(slidingItem: IonItemSliding) {
    console.log("opne");

    this.num = 0;
    slidingItem.close();
    console.log("else---else", this.num);
  }

  closeslide(slidingItem: IonItemSliding) {
    this.dismiss();
    this.num = 0;
    slidingItem.close();
  }

  ////======================done==================================//
  goBack() {
    this.location.back();
  }

  hideDiscCard(){
    this.displaydiv = false;
  }

  getTime(val:any){
    return val.substring(0,5);
  }

  goToProfile() {
    this.router.navigate(["profile"]);
  }

  claimDrag() {
    this.num++;
    console.log("dragggggg---", this.num);
    if (this.num >= 30) {
      this.displaydiv = true;
      this.num = 0;
    }
    console.log("dragggggg---44444", this.num);
  }

  public goLocation() {
    this.rest.detail = this.detailObj;
    this.rest.comingForLoc =true;
    this.router.navigate(['/locationmap'],{
      queryParams:{'cardType': 'event'}
    });
    // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    // var geocoords = this.detailObj.lattitude + "," + this.detailObj.longitude;

    // if (this.platform.is("ios")) {
    //   window.open("maps://?q=" + geocoords, "_system");
    // } else {
    //   var label = encodeURI(this.detailObj.location); // encode the label!
    //   window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");

    //   // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    // }
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

  like() {
    console.log("like---", this.detailObj);
  }
  likeout() {
    console.log("likeout---", this.detailObj);
  }

  likeevent() {
    console.log("likeevent", this.detailObj);

    if (this.detailObj.likes == 0) {
      this.detailObj.likes = 1;
      this.likeDislikeUSerEvents(this.detailObj.events_id);
    }
  }
  likeoutevent() {
    console.log("likeoutevent", this.detailObj);

    if (this.detailObj.likes == 1) {
      this.detailObj.likes = 0;
      this.likeDislikeUSerEvents(this.detailObj.events_id);
    }
  }

  likeDislikeUSerEvents(events_id: any) {
    console.log(events_id);

    var ss = JSON.stringify({
      users_customers_id: this.userID,
      events_id: events_id,
    });

    console.log(ss);

    this.rest.events_like_unlike(ss).subscribe((res: any) => {
      console.log(res);
    });
  }

  goToSee() {
    this.router.navigate(["seepeopleevent"]);
  }

  updatevVisitor() {
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      events_id: this.detailObj.events_id,
    });

    console.log("ss updatevVisitor-----", ss);

    this.rest.update_visitors_events(ss).subscribe((res: any) => {
      console.log("res updatevVisitor-----", res);
    });
  }

  buyTicket() {
    console.log("buy");
    this.router.navigate(['booking1event'])
  }
}
