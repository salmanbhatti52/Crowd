import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-scan-tickets',
  templateUrl: './scan-tickets.page.html',
  styleUrls: ['./scan-tickets.page.scss'],
})
export class ScanTicketsPage implements OnInit {
  onesignalid: any = "";
  social_login_status: any = "";
  constructor(public location:Location,
    public navCtrl:NavController) { }

  ngOnInit() {
  }

  goBack(){
    // this.location.back();
  }

  goLogout(){
    this.onesignalid = localStorage.getItem("onesignaluserid");
    this.social_login_status = localStorage.getItem("social_login_status");

    localStorage.clear();
    localStorage.setItem("onesignaluserid", this.onesignalid);
    localStorage.setItem("social_login_status", this.social_login_status);
    this.navCtrl.navigateRoot(["login"]);
  }

  gotoTicketDetail(){
    this.navCtrl.navigateForward('ticket-detail');
  }
}
