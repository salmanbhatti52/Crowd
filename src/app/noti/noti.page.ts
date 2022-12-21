import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-noti",
  templateUrl: "./noti.page.html",
  styleUrls: ["./noti.page.scss"],
})
export class NotiPage implements OnInit {
  userdata: any = "";
  userid: any = "";
  notiArr: any = "";
  noticount = 0;
  constructor(public router: Router, public rest: RestService) {}

  ionViewWillEnter() {
    this.noticount = 0;

    this.userdata = localStorage.getItem("userdata");

    this.userid = JSON.parse(this.userdata).users_customers_id;

    console.log("userid----", this.userid);

    var ss = JSON.stringify({
      users_customers_id: this.userid,
    });
    console.log("ss-----", ss);

    this.rest.presentLoader();

    this.rest.notifications(ss).subscribe((res: any) => {
      console.log("res-----", res);

      this.rest.dismissLoader();

      if (res.status == "error") {
        this.noticount = 1;
        this.rest.presentToast("No notifications found");
      } else {
        this.noticount = 2;
        this.notiArr = res.data;
      }
    });
  }

  ngOnInit() {}
  goToProfile() {
    this.router.navigate(["profile"]);
  }
  tab1Click() {
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.router.navigate(["noti"]);
  }

  calculatedate(opt: any) {
    //moment(opt, "YYYYMMDD").fromNow(); // 11 years ago
  }
}
