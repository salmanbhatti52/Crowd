import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.page.html",
  styleUrls: ["./otp.page.scss"],
})
export class OtpPage implements OnInit {
  otpp: any = "";
  constructor(public router: Router, public rest: RestService) {}

  ngOnInit() {}

  onOtpChange(event: any) {
    console.log(event, "eventevent");
    this.otpp = event;
  }

  newPass() {
    if (this.otpp == "") {
      this.rest.presentToast("Please enter OTP");
    } else if (this.otpp != localStorage.getItem("otp")) {
      this.rest.presentToast("Please enter correct OTP");
    } else {
      this.router.navigate(["newpass"]);
    }
  }
}
