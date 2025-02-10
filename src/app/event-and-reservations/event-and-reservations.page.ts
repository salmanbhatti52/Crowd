import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-event-and-reservations',
  templateUrl: './event-and-reservations.page.html',
  styleUrls: ['./event-and-reservations.page.scss'],
})
export class EventAndReservationsPage implements OnInit {
  eventsAndReservationsTerms:any;
  constructor(public location:Location, public rest:RestService) {
   }

  ngOnInit() {
    this.getEventsReservationsTerms();
  }

  goBack(){
    this.location.back();
  }

  getEventsReservationsTerms(){
    this.rest.presentLoader();
    this.rest.getRequest("get_events_reservations").subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Ev's and Reserves Terms : ",res);
      this.eventsAndReservationsTerms = res.data[0];
      console.log("Ev's and Reserves Terms : ",this.eventsAndReservationsTerms);
    })
  }

  getDateSlashFormat(val:any){
    if(val){
      return format(new Date(val), 'M/d/yyyy');
    }
    else{
      return val;
    }
  }


}
