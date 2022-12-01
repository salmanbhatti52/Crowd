import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  constructor(public location: Location, public router: Router) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  changePass() {
    this.router.navigate(["changepass"]);
  }
  goLogout() {
    this.router.navigate(["login"]);
  }

  godelete() {
    this.router.navigate(["deletact"]);
  }
}
