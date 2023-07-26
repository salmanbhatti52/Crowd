import { Component, OnInit } from '@angular/core';
import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
// import * as moment from "moment";
import { format, parseISO } from 'date-fns';
@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {
  segmentModel = "Upcoming";

  upcomingArr: any = [];
  orderd_upcomingArr: any = [];
  previousArr: any = [];
  orderd_previousArr: any =[];

  userdata: any = "";
  userID: any = "";
  constructor(
    public location: Location,
    public modalCtrl: ModalController,
    public rest: RestService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.rest.presentLoader();
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    var ss = {
      users_customers_id: this.userID,
      lattitude: localStorage.getItem("longitude"),
      longitude: localStorage.getItem("lattitude"),
    };

    this.rest.sendRequest("get_upcoming_events_list",ss).subscribe((res: any) => {
      console.log("get_upcoming_events_list------", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.upcomingArr = res.data;
        for(let i= this.upcomingArr.length-1, j=0; i>=0; i--){
          this.orderd_upcomingArr[j] = this.upcomingArr[i];
          j++;        
        }
        console.log("orderd_upcomingArr: ",this.orderd_upcomingArr);
        
      }
    });

    this.rest.sendRequest("get_previous_events_list",ss).subscribe((res: any) => {
      console.log("get_previous_events_list------", res);
      this.rest.dismissLoader();
      if (res.status == "success") {
        this.previousArr = res.data;
        for(let i= this.previousArr.length-1, j=0; i>=0; i--){
          this.orderd_previousArr[j] = this.previousArr[i];
          j++;        
        }
        console.log("orderd_previousArr: ",this.orderd_previousArr);
      }
    });
  }

  gotoEventDetails(data:any){
    this.rest.detail = data;
    console.log('this.rest.detail: ',this.rest.detail);
    
    this.router.navigate(['/event-detail']);
  }

 
  goBack() {
    this.router.navigate(['/profile']);
  }

  handleRefresh(ev: any) {}

  async cancelBooking(aa: any) {
    this.rest.selectedBooking = aa;
    console.log("model");
    this.rest.comingFrom = "myreservation";
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });
    modal.onDidDismiss().then((data) => {
      console.log("aaaaaaaaaaaaaa");
      this.ionViewWillEnter();

      const user = data["data"]; // Here's your selected user!
    });

    await modal.present();
  }

  getDate(aa: any) {
    return format(parseISO(new Date(aa).toISOString()) ,"MMM dd yyyy");
  }
  getTime(val:any){
    if(val){
      return val.substring(0,5);
    }
  }

  editbooking(aa: any) {
    this.rest.selectedBooking = aa;
    this.router.navigate(["editbooking"]);
  }
}
