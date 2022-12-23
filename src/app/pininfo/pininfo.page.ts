import { ModalController } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-pininfo",
  templateUrl: "./pininfo.page.html",
  styleUrls: ["./pininfo.page.scss"],
})
export class PininfoPage implements OnInit {
  searchObject: any = "";

  constructor(
    public rest: RestService,
    public location: Location,
    public router: Router,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.searchObject = this.rest.pinobject;

    console.log("log---------", this.searchObject);
  }

  goBack() {
    this.location.back();
  }

  gotodetail() {
    this.hideModel();
    console.log(this.searchObject);
    this.rest.detail = this.searchObject;
    this.router.navigate(["venuedetail"]);
  }

  async hideModel() {
    await this.modalCtrl.dismiss();
  }
}
