import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Platform,IonItemSliding } from "@ionic/angular";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
  detailObj: any = "";
  displaydiv = false;
  num = 0;

  userdata: any = "";
  userID: any = "";
  selectedEvent: any = "";
  ticketTotal:any;
  organizer: any;
  latitude: string | null | undefined;
  longitude: string | null | undefined;
  ticketsRequestedForRefund = 0;
  constructor(public location:Location,
    public router:Router,
    public platform: Platform,
    public iab: InAppBrowser,
    public rest:RestService) { }
    
    ngOnInit() {
      
      this.selectedEvent = this.rest.detail;
     
      this.detailObj = this.rest.detail;
      this.ticketTotal = this.detailObj.price_per_ticket * this.detailObj.number_of_ticket;
      this.ticketTotal = this.convertInDecimal(this.ticketTotal)
      console.log("detaill----", this.detailObj);

      // if(this.detailObj.requested_tickets.length > 0){
      //   for(let data of this.detailObj.requested_tickets){
      //     this.ticketsRequestedForRefund = this.ticketsRequestedForRefund + data.requested_tickets
      //   }
        
      // }

      // this.rest.ticketsRequestedForRefund = this.ticketsRequestedForRefund;
      // this.rest.availableTicketsForRefund = this.detailObj.number_of_ticket - this.ticketsRequestedForRefund
      this.rest.availableTicketsForRefund = this.detailObj.ticket.length;
      console.log("ticketsRequestedForRefund: ",this.ticketsRequestedForRefund);
      console.log("ticketsRequestedForRefund Rest: ",this.rest.ticketsRequestedForRefund);
      console.log("availableTicketsForRefund: ",this.rest.availableTicketsForRefund);
      
    }
    
    ionViewWillEnter() {
      this.userdata = localStorage.getItem("userdata");
      console.log("userdata----", this.userdata);
      this.userID = JSON.parse(this.userdata).users_customers_id;

      this.latitude = localStorage.getItem('lattitude');
      this.longitude = localStorage.getItem('longitude');
      
      this.updatevVisitor();
      this.getBusinessList();
    }

    getBusinessList(){
      this.rest.presentLoader();
      this.rest.getRequest('get_business_list').subscribe((res:any)=>{
        this.rest.dismissLoader();
        console.log("Ress:", res);
        if(res.status=='success'){
          // this.businessList = res.data;
          console.log("Organizer Data before: ",this.organizer);
          for(let i=0; i<res.data.length; i++){
            if(this.detailObj.user_business_id == res.data[i].users_business_id){
              console.log("users_business_id: ",this.detailObj.users_business_id);
              
              console.log("Match found", res.data[i]);
              
              this.organizer = res.data[i];
              this.rest.business_owner_name = this.organizer.first_name;            
            }
          }
        }
        console.log("Organizer Data: ",this.organizer);
      },(err)=>{
        this.rest.dismissLoader();
        console.log("Errr: ",err);
        
      })
    }

    convertInDecimal(x:any) {
      let decimalString =  Number.parseFloat(x).toFixed(2);
      console.log("dec str: ", decimalString);
      return Number.parseFloat(decimalString);
    }

    gotoOrganizerEvents(){
      this.rest.orgEventsArr = [];
      let data = {
        users_business_id:this.detailObj.user_business_id,
        users_customers_id:this.userID,
        longitude:this.longitude,
        lattitude:this.latitude,
        page_number:"1"
      }
      console.log("Api dataa: ",data);
      this.rest.presentLoader();
      this.rest.sendRequest('get_business_events',data).subscribe((res:any)=>{
        this.rest.dismissLoader();
        console.log("Org events REssssss: ",res);
        
        this.rest.orgEventsArr = res.data;
        this.router.navigate(['/organizer-events']);
        
      },(err)=>{
        this.rest.dismissLoader();
        console.log("errrr: ",err);
        
      })
    }

    goBack() {
      this.location.back();
    }

    getTime(val:any){
      return val.substring(0,5);
    }

    goToProfile() {
      this.router.navigate(["profile"]);
    }

    public goLocation() {
      // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
      var geocoords = this.detailObj.events.lattitude + "," + this.detailObj.events.longitude;
  
      if (this.platform.is("ios")) {
        window.open("maps://?q=" + geocoords, "_system");
      } else {
        var label = encodeURI(this.detailObj.events.location); // encode the label!
        window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");
  
        // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
      }
    }

    // public goLocation() {
    //   // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    //   var geocoords =
    //     this.selectedVenue.lattitude + "," + this.selectedVenue.longitude;
  
    //   if (this.platform.is("ios")) {
    //     window.open("maps://?q=" + geocoords, "_system");
    //   } else {
    //     var label = encodeURI(this.selectedVenue.location); // encode the label!
    //     window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");
  
    //     // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    //   }
    // }
  
    goWeb() {
      console.log("dragggggg", this.detailObj.events.website);
      const browser = this.iab.create(this.detailObj.events.website);
    }
  
    goCall() {
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
  
      if (this.detailObj.events.likes == 0) {
        this.detailObj.events.likes = 1;
        this.likeDislikeUSerEvents(this.detailObj.events.events_id);
      }
    }
    likeoutevent() {
      console.log("likeoutevent", this.detailObj);
  
      if (this.detailObj.events.likes == 1) {
        this.detailObj.events.likes = 0;
        this.likeDislikeUSerEvents(this.detailObj.events.events_id);
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
  
    viewTicket() {
      // this.rest.comfrom = 'event-detail';
      this.rest.billDetails.ticket_requested = this.detailObj.number_of_ticket;
      this.rest.ticketTokens = this.detailObj.ticket;
      this.rest.billDetails.event_name = this.detailObj.events.name
      this.rest.billDetails.venue_name = this.detailObj.events.venue_name
      this.rest.billDetails.event_date = this.detailObj.events.event_date
      this.rest.billDetails.event_start_time = this.detailObj.events.event_start_time
      this.rest.billDetails.event_end_time = this.detailObj.events.event_end_time
      this.rest.billDetails.package_type = this.detailObj.package_type
      this.rest.billDetails.package_name = this.detailObj.package_name
      this.rest.billDetails.package_price = this.detailObj.package_price
      this.rest.billDetails.price_per_ticket = this.detailObj.price_per_ticket
      this.rest.billDetails.total_bill =  this.detailObj.total_amount
      this.rest.billDetails.location =  this.detailObj.events.location
      this.rest.bookingStatus =  this.detailObj.status
      this.rest.transactionStatus = this.detailObj.transiction_status
      this.rest.eventBookingId = this.detailObj.event_booking_id
      this.rest.eventId = this.detailObj.events_id
      this.rest.billDetails.pre_pay_amount = this.detailObj.paid_amount
      this.rest.billDetails.remaining_amount = this.detailObj.remaining_amount;
      this.rest.discountPercentage = this.detailObj.events.discount_percentage
      this.rest.discountedAmount = this.detailObj.discounted_amount
      console.log("buy");
      this.rest.comfrom = 'event-detail'
      this.router.navigate(['ticket'])
    }

    goToChat() {
      var ss = {
        requestType: "startChat",
        users_customers_id: this.userID,
        other_users_customers_id: this.detailObj.events.users_business_id,
        events_id: this.detailObj.events.events_id,
      };
      console.log("payload start event ChatPage", ss);
      
  
      this.rest.sendRequest('users_chat',ss).subscribe((res: any) => {
        console.log(res);
        if (res.status == "success"){
          this.rest.comingFrom = 'event-detail'
          this.router.navigate(["chat"]);
        } 
      });
    }

    // gotoOrganizerEvents(){
    //   this.router.navigate(['/organizer-events']);
    // }
}
