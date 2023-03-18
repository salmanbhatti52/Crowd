import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-seepeopleevent",
  templateUrl: "./seepeopleevent.page.html",
  styleUrls: ["./seepeopleevent.page.scss"],
})
export class SeepeopleeventPage implements OnInit {
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
      events_id: this.rest.detail.events_id,
    });
    console.log("ionvire enter", this.rest.detail.events_id);

    this.rest.presentLoader();
    this.rest.get_visitors_events_list(ss).subscribe((res: any) => {
      this.rest.dismissLoader();
      console.log(res);

      if (res.status == "success") {
        // this.rest.presentToast(res.message);
        this.visitorArr = res.data;
      } else {
        this.rest.presentToast(res.message);
      }
    });
  }

  handleRefresh(ev: any) {
    console.log("ev-----", ev);
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    this.ionViewWillEnter();
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }
}
