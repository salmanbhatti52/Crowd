import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-saved",
  templateUrl: "./saved.page.html",
  styleUrls: ["./saved.page.scss"],
})
export class SavedPage implements OnInit {
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
}
