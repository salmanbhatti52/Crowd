import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { RestService } from '../rest.service';
@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.page.html',
  styleUrls: ['./ticket-detail.page.scss'],
})
export class TicketDetailPage implements OnInit {
  onesignalid: any = "";
  social_login_status: any = "";
  result:any[] = [];
  eventName:any;
  venueName:any;
  eventDate:any;
  eventStartTime:any;
  eventEndTime:any;
  packageType:any;
  packageName:any;
  packagePrice:any;
  ticketPrice:any;
  ticketRequested:any;
  crowdFee:any;
  totalBill:any;
  eventLocation:any;
  bookingStatus:any;
  transactionStatus:any;
  randomString: any;
  prePaidAmount: any;
  remainingAmount: any;
  ticketId:any;
  constructor(public location:Location,
    public navCtrl:NavController,
    public rest:RestService) {
      
     }

  ngOnInit() {
    this.rest.presentLoaderWd();
    this.result = this.rest.barcodeResult.split('_');
    console.log("Result: ",this.result);
    this.eventName= this.result[0];
    this.venueName= this.result[1];
    this.eventDate= this.result[2];
    this.eventStartTime= this.result[3];
    this.eventEndTime= this.result[4];
    this.packageType= this.result[5];
    this.packageName= this.result[6];
    this.packagePrice= this.result[7];
    this.ticketPrice= this.result[8];
    this.ticketRequested= this.result[9];
    this.crowdFee = this.result[10];
    this.totalBill= this.result[11];
    this.eventLocation= this.result[12];
    this.bookingStatus= this.result[13];
    this.transactionStatus= this.result[14];
    this.randomString = this.result[15];
    this.prePaidAmount = this.result[16];
    this.remainingAmount = this.result[17];
    this.ticketId = this.result[18];

    let data = {
      tickets_id: this.ticketId
    };
    this.rest.sendRequest('scanned_tickets',data).subscribe((res:any)=>{
      console.log("scanned_tickets Res: ",res);
      if(res.status == 'success'){
        console.log("Ticket Scanned. Record Updated");
        
      }
      
    })
    // this.rest.dismissLoader();
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
    this.navCtrl.navigateRoot(["login"]);
  }

  // gotoScannedTickets(){
  //   this.navCtrl.navigateForward('scanned-tickets');
  // }

}
