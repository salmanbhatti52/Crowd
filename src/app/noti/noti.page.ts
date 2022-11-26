import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-noti",
  templateUrl: "./noti.page.html",
  styleUrls: ["./noti.page.scss"],
})
export class NotiPage implements OnInit {
  constructor(public router: Router) {}

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
}
