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
  userID: any = "";
  userdata: any = "";

  constructor(
    public rest: RestService,
    public location: Location,
    public router: Router,
    public modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.searchObject = this.rest.pinobject;
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    this.userID = JSON.parse(this.userdata).users_customers_id;
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

  likevenu() {
    console.log("likevenu", this.searchObject);

    if (this.searchObject.likes == 0) {
      this.searchObject.likes = 1;
      this.likeDislikeUServenu(this.searchObject.venues_id);
    }
  }
  likeoutvenu() {
    console.log("likeoutvenu", this.searchObject);

    if (this.searchObject.likes == 1) {
      this.searchObject.likes = 0;
      this.likeDislikeUServenu(this.searchObject.venues_id);
    }
  }

  likeDislikeUServenu(events_id: any) {
    console.log(events_id);
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: events_id,
    });

    console.log(ss);
    this.rest.venues_like_unlike(ss).subscribe((res: any) => {
      console.log(res);
    });
  }
}
