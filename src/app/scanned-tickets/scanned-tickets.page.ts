import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { RestService } from '../rest.service';
@Component({
  selector: 'app-scanned-tickets',
  templateUrl: './scanned-tickets.page.html',
  styleUrls: ['./scanned-tickets.page.scss'],
})
export class ScannedTicketsPage implements OnInit {
  onesignalid: any = "";
  social_login_status: any = "";
  selectedEvent:any = {
    event_id: '1',
    event_name: 'Event Name',
  };
  eventShow = false;
  recordFound = true;
  eventsArr:any = [];
  ticketsArr:any = [];
  scannedTickets:any  = [];
  constructor(public location:Location,
    public navCtrl:NavController,
    public rest:RestService) { }

  ionViewWillEnter() {
    let data = {
      users_business_id: localStorage.getItem('user_business_id')
    }
    console.log("scanned tickets payload: ", data);
    this.rest.sendRequest('business_scanned',data).subscribe((res:any)=>{
      console.log("Ress: ",res);
      
      if(res.status == 'success'){
        this.ticketsArr = res.data;
      }
      
    })

    this.rest.presentLoader();
    this.rest.sendRequest('get_events_for_app',data).subscribe((res2:any)=>{
      this.rest.dismissLoader();
      console.log("Res: ",res2);
     
      if(res2.status == 'success'){
        for(let rec of res2.data){
          let ev = {
            event_id: rec.events_id,
            event_name: rec.name,
          }
          this.eventsArr.push(ev);
        }
        console.log("this.eventsArr",this.eventsArr);
      } 
    })
    this.rest.dismissLoader();
  }
  ngOnInit() {
    
  }

  hideShowEvents() {
    if (this.eventShow) {
      this.eventShow = false;
    } else {
      this.eventShow = true;
    }
  }

  eventClick(a: any) {
    this.recordFound = true;
    this.eventShow = false;
    console.log(a);
    this.selectedEvent = a;
    this.scannedTickets = [];
    for(let ticket of this.ticketsArr){
      if(this.selectedEvent.event_id == ticket.events_id){
        this.scannedTickets.push(ticket)
      }
    }
    if(this.scannedTickets.length == 0){
      this.recordFound = false;
    }
    console.log("SelectedEvent: ",this.selectedEvent);
    console.log("ScannedTicets: ",this.scannedTickets);
    
  }

  goBack(){
    this.location.back();
  }

  goLogout(){
    this.onesignalid = localStorage.getItem("onesignaluserid");
    this.social_login_status = localStorage.getItem("social_login_status");

    localStorage.clear();
    localStorage.setItem("onesignaluserid", this.onesignalid);
    localStorage.setItem("social_login_status", this.social_login_status);
    this.navCtrl.navigateRoot(["loginevent"]);
  }
}
