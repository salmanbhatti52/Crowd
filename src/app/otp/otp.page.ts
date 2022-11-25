import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.page.html",
  styleUrls: ["./otp.page.scss"],
})
export class OtpPage implements OnInit {
  otpp: any = "";
  constructor(public router: Router) {}

  ngOnInit() {}

  onOtpChange(event: any) {
    console.log(event, "eventevent");
    this.otpp = event;
  }

  newPass() {
    this.router.navigate(["newpass"]);
  }
}
