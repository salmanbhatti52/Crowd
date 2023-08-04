import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

import { Router } from '@angular/router';
import { RestService } from '../rest.service';

import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-show-tickets',
  templateUrl: './show-tickets.page.html',
  styleUrls: ['./show-tickets.page.scss'],
})
export class ShowTicketsPage implements OnInit {
  noOfTickets=0;
  ticketId = 'ticket';
  data1 = ''
  data2:any =[];
  
  pdfObj:any;
  photoPreview:any;
  myAngularxQrCode: string = ''
  userdata: any;
  userName: any;
  userId:any;

  
  tickets:any;

  interval:any;
 
  ss:any;
  content!: string;
  
  activeIndex: any;
  currentTicketToken: any;
  refundRequestCount: any;

  constructor(public location:Location,
    public router:Router,
    public rest:RestService,
    private plt:Platform,
     ) { }

    async ngOnInit() {

      console.log("ngOnInitFired");
      
      this.noOfTickets = this.rest.ticketsData.events_bookings.number_of_ticket;
      console.log("Number Of Tickets: ",this.noOfTickets);
  
      // if(this.rest.comfrom == 'paymentmethod'){
      //   this.rest.availableTicketsForRefund = this.noOfTickets;
      //   console.log("availableTicketsForRefund: ",this.rest.availableTicketsForRefund);
      // }
       // console.log("qrCodeDAta: ", this.myAngularxQrCode);
      
        this.userdata = localStorage.getItem('userdata');
        this.userName = JSON.parse(this.userdata).username;
        this.userId = JSON.parse(this.userdata).users_customers_id;
        this.tickets = this.rest.ticketTokens;
  
        for (let index = 0; index < this.tickets.length; index++) {
          if(this.rest.ticketsData){
            // event_name, venue_name, event_date, event_start_time, event_end_time,package_type, package_name, package_price, price_per_ticket, ticket_requested, crowd_fee, total_bill, location, bookingStatus, transactionStatus, random_string,prePaid amount, remaining amount, ticket_id
            this.tickets[index].my_qr_code = `${this.rest.ticketsData.events.name}_${this.rest.ticketsData.events.venue_name}_${this.rest.ticketsData.events.event_date}_${this.rest.ticketsData.events.event_start_time}_${this.rest.ticketsData.events.event_end_time}_${this.rest.ticketsData.events_bookings.package_type}_${this.rest.ticketsData.events_bookings.package_name}_£${this.rest.ticketsData.events_bookings.package_price}_£${this.rest.ticketsData.events_bookings.price_per_ticket}_${this.rest.ticketsData.events_bookings.number_of_ticket}_£5_£${this.rest.ticketsData.events_bookings.total_amount}_${this.rest.ticketsData.events.location}_${this.rest.ticketsData.events_bookings.status}_${this.rest.ticketsData.events_bookings.transiction_status}_${this.tickets[index].random_string}_${this.rest.ticketsData.events_bookings.paid_amount}_${this.rest.ticketsData.events_bookings.remaining_amount}_${this.tickets[index].tickets_id}`;
          }
          
        }
        console.log("this.tickets: ",this.tickets);
  
      
      
        
        
    }
  
    ionViewWillEnter() {
      
    }

    onSlideChange(ev:any){
      // console.log("Swiper EVVV",ev);
      // console.log("active Index is ",ev.detail[0].activeIndex);
      // this.activeIndex = ev.detail[0].activeIndex;
      // for(let i=0; i<this.tickets.length; i++){
      //   if(this.activeIndex == i ){
      //     this.currentTicketToken = this.tickets[i];
      //   }
      // }
    }

    goBack(){
      // console.log(this.rest.comfrom);
      // this.rest.presentLoaderWd();
      // if(this.rest.comfrom == 'paymentmethod'){
        // this.rest.dismissLoader();
        // console.log(this.rest.comfrom);
        
        // this.router.navigate(['/home']);
        // this.rest.comfrom = '';
      // }else{
        // this.rest.dismissLoader();
        // console.log(this.rest.comfrom);/
        this.location.back();
      // }
    }

    getTime(val:any){
      if(val){
        return val.substring(0,5);
      }
    }

}
