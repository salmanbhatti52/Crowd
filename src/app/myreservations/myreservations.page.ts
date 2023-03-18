import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";

@Component({
  selector: "app-myreservations",
  templateUrl: "./myreservations.page.html",
  styleUrls: ["./myreservations.page.scss"],
})
export class MyreservationsPage implements OnInit {
  segmentModel = "Upcoming";
  constructor(public location: Location, public modalCtrl: ModalController) {}

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
}
