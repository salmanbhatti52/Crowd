import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-seepeople",
  templateUrl: "./seepeople.page.html",
  styleUrls: ["./seepeople.page.scss"],
})
export class SeepeoplePage implements OnInit {
  userdata: any = "";
  visitorArr: any = "";
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService
  ) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    var ss = JSON.stringify({
      venues_id: this.rest.detail.venues_id,
    });
    console.log("ionvire enter", this.rest.detail.venues_id);

    this.rest.presentLoader();
    this.rest.get_visitors_list(ss).subscribe((res: any) => {
      this.rest.dismissLoader();
      console.log(res);

      if (res.status == "success") {
        this.rest.presentToast(res.message);
        this.visitorArr = res.data;
      } else {
        this.rest.presentToast(res.message);
      }
    });
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }
}
