import { Component, OnInit } from '@angular/core';
import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
// import * as moment from "moment";
import { format, parse, parseISO } from 'date-fns';
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
  deleteOldBooking: boolean = false;
  constructor(
    public location: Location,
    public modalCtrl: ModalController,
    public rest: RestService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.segmentModel = 'Upcoming';
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
    this.getUpcomingBookings();
  }

  segmentChanged(event: any) {
    console.log(this.segmentModel);
    console.log("eee", event);
  }

  deleteBooking(){
    this.deleteOldBooking = true;
  }

  // deleteReservation(){
  // }

  closeModel(){
    this.deleteOldBooking = false;
    // this.changeDetectorRef.detectChanges();
  }
  
  getUpcomingBookings(){
    if(this.orderd_upcomingArr.length == 0){
      this.rest.presentLoader();
    }
    var ss = {
      users_customers_id: this.userID,
      lattitude: localStorage.getItem("longitude"),
      longitude: localStorage.getItem("lattitude"),
    };

    this.rest.sendRequest("get_upcoming_events_list",ss).subscribe((res: any) => {
      console.log("get_upcoming_events_list------", res);
      if(this.orderd_upcomingArr.length == 0){
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.upcomingArr = res.data;
        this.orderd_upcomingArr = this.upcomingArr;
        // for(let i= this.upcomingArr.length-1, j=0; i>=0; i--){
        //   this.orderd_upcomingArr[j] = this.upcomingArr[i];
        //   j++;        
        // }
        console.log("orderd_upcomingArr: ",this.orderd_upcomingArr);
        
      }
    });
  }

  getPreviousBookings(){
    if(this.orderd_previousArr.length == 0){
      this.rest.presentLoader();
    }
    var ss = {
      users_customers_id: this.userID,
      lattitude: localStorage.getItem("longitude"),
      longitude: localStorage.getItem("lattitude"),
    };

    this.rest.sendRequest("get_previous_events_list",ss).subscribe((res: any) => {
      console.log("get_previous_events_list------", res);
      if(this.orderd_previousArr.length == 0){
        this.rest.dismissLoader();
      }
      if (res.status == "success") {
        this.previousArr = res.data;
        this.orderd_previousArr = this.previousArr;
        // for(let i= this.previousArr.length-1, j=0; i>=0; i--){
        //   this.orderd_previousArr[j] = this.previousArr[i];
        //   j++;        
        // }
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

  getTime(val:any){
    if(val){
       val = parse(val, 'HH:mm:ss', new Date());
       return val = format(val, 'h:mma');
    }
    else{
      return val;
    }
  }
  

  getDate(val:any){
    if(val){
      return format(new Date(val), 'E, do MMM');
    }
    else{
      return val;
    }
  }

  editbooking(aa: any) {
    this.rest.selectedBooking = aa;
    this.router.navigate(["editbooking"]);
  }
}
