import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  userdata: any = "";
  noti: any = "No";
  uname: any = "";
  name: any = "";
  email: any = "";
  constructor(public location: Location, public router: Router) {}

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);

    this.email = JSON.parse(this.userdata).email;
    this.name = JSON.parse(this.userdata).full_name;
    this.uname = JSON.parse(this.userdata).username;
    console.log("email----", this.email);
  }
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

  notitoggle(event: any) {
    console.log(event.detail.checked);

    if (event.detail.checked) {
      this.noti = "Yes";
    } else {
      this.noti = "No";
    }

    console.log(this.noti);
  }

  save() {
    console.log("save");
  }
}
