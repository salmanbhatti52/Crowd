import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-request-refund',
  templateUrl: './request-refund.page.html',
  styleUrls: ['./request-refund.page.scss'],
})
export class RequestRefundPage implements OnInit {
  ticketRequested:any;
  availableTickets: any;
  userdata:any;
  userId:any;
  tickets: any;
  constructor(public location:Location,
    public rest:RestService,
    public router:Router,
    public navCtrl:NavController) {
    
   }

  ngOnInit() {
    // if(this.rest.billDetails.ticket_requested){
      // this.availableTickets = this.rest.billDetails.ticket_requested;
      this.availableTickets = this.rest.availableTicketsForRefund;
      // console.log(this.availableTickets);
      // if(this.rest.ticketsRequestedForRefund == 1){
      //   this.rest.presentToast(`You have previously sent refund request for ${this.rest.ticketsRequestedForRefund} ticket`)
      // }else if(this.rest.ticketsRequestedForRefund > 1){
      //   this.rest.presentToast(`You have previously sent refund request for ${this.rest.ticketsRequestedForRefund} tickets`)

      // }else{

      // }
      
    // }
  }

  ionViewWillEnter() {
    this.tickets = this.rest.ticketTokens;
    this.userdata = localStorage.getItem('userdata');
    this.userId = JSON.parse(this.userdata).users_customers_id;
  }

  // getTicketCount(ev:any){

  //   if(this.ticketRequested > this.availableTickets){
  //     this.ticketRequested = 0;
  //     this.rest.presentToast(`Available tickets for refund are ${this.availableTickets}.`);
  //   }  
  
  //   console.log("tickets requested", this.ticketRequested);
    
    
  // }

  requestRefund(){
    if(this.ticketRequested > this.availableTickets){
      this.rest.presentToast(`Available tickets for refund are ${this.availableTickets}.`);
      this.ticketRequested = undefined;
      
    }else if(this.ticketRequested > 0){
      console.log("users_customers_id:",this.userId);
      console.log("event_booking_id:",this.rest.eventBookingId,);
      console.log("events_id:", this.rest.eventId);
      let ticketIds:any = []
      for(let i=0; i<this.ticketRequested; i++){
        ticketIds.push(this.tickets[i].tickets_id); 
      }
      console.log("ticketIds: ",ticketIds);
      
      let data = {
        users_customers_id:this.userId,
        event_booking_id:this.rest.eventBookingId,
        events_id: this.rest.eventId,
        requested_tickets: this.ticketRequested,
        tickets_id:ticketIds
      }
      console.log("Refund Req Payload: ",data);
      
      this.rest.presentLoaderWd();
      this.rest.sendRequest('request_refund',data).subscribe((res:any)=>{
        this.rest.dismissLoader();
        console.log("Refund Request Res: ", res);
        if(res.status== 'success'){
          this.rest.presentToast('Refund Request Sent.');
          this.navCtrl.navigateRoot('my-refunds');
        }else if(res.status == 'error'){
          console.log(res);
          this.rest.presentToast(res.message);
        }
        
      },(error:any)=>{
        this.rest.presentToast("Server error. Try again later.");
        this.rest.dismissLoader();
      });
    }
    else {
      this.ticketRequested = undefined;
      this.rest.presentToast('Plz enter number of tickets for refund');
    }
    
  }
  goBack(){
    this.location.back();
  }
}
