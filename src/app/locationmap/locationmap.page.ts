import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-locationmap",
  templateUrl: "./locationmap.page.html",
  styleUrls: ["./locationmap.page.scss"],
})
export class LocationmapPage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

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
  goToProfile() {
    this.router.navigate(["profile"]);
  }
}
