import { RestService } from "./../rest.service";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";

import * as moment from "moment";

@Component({
  selector: "app-myreservations",
  templateUrl: "./myreservations.page.html",
  styleUrls: ["./myreservations.page.scss"],
})
export class MyreservationsPage implements OnInit {
  segmentModel = "Upcoming";

  upcomingArr: any = "";
  previousArr: any = "";

  userdata: any = "";
  userID: any = "";

  constructor(
    public location: Location,
    public modalCtrl: ModalController,
    public rest: RestService
  ) {}

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    var ss = JSON.stringify({
      users_customers_id: this.userID,
    });

    this.rest.bookings_upcoming(ss).subscribe((res: any) => {
      console.log("bookings_upcoming------", res);
      if (res.status == "success") {
        this.upcomingArr = res.data;
      }
    });

    this.rest.bookings_previous(ss).subscribe((res: any) => {
      console.log("bookings_previous------", res);

      if (res.status == "success") {
        this.previousArr = res.data;
      }
    });
  }

  ngOnInit() {}
  goBack() {
    this.location.back();
  }

  handleRefresh(ev: any) {}

  async cancelBooking() {
    console.log("model");
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });

    await modal.present();
  }

  getDate(aa: any) {
    return moment(aa).format("MMM DD YYYY");
  }
}
