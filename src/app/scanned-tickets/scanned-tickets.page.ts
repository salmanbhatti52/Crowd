import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-scanned-tickets',
  templateUrl: './scanned-tickets.page.html',
  styleUrls: ['./scanned-tickets.page.scss'],
})
export class ScannedTicketsPage implements OnInit {
  onesignalid: any = "";
  social_login_status: any = "";
  people = 2;
  peopleShow = false;
  peopleArr = [
    {
      id: 1,
      people: 1,
      name: "people",
    },
    {
      id: 2,
      people: 2,
      name: "people",
    },
    
  ];
  constructor(public location:Location,
    public navCtrl:NavController) { }

  ngOnInit() {
  }

  hideShowPeople() {
    if (this.peopleShow) {
      this.peopleShow = false;
    } else {
      this.peopleShow = true;
    }
  }

  peopleClick(a: any) {
    this.peopleShow = false;
    console.log(a);
    this.people = a.people;
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
}
