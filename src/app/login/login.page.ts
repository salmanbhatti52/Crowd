import { RestService } from "./../rest.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  email: any = "";
  pass: any = "";
  constructor(public router: Router, public rest: RestService) {}

  ngOnInit() {}

  goToSignup() {
    this.router.navigate(["signup"]);
  }

  goToForgetpass() {
    this.router.navigate(["forgetpass"]);
  }
  getStart() {
    this.router.navigate(["getstart"]);
  }

  submit() {
    this.router.navigate(["getstart"]);

    // if (this.email == "") {
    //   this.rest.presentToast("Please enter valid email.");
    // }

    // if (this.pass == "") {
    //   this.rest.presentToast("Please enter password.");
    // }

    // if (this.email == "" || this.pass == "") {
    //   this.rest.presentToast("Please enter required fields.");
    // } else {
    //   var ss = JSON.stringify({
    //     email: this.email,
    //     password: this.pass,
    //     // account_type: "SignupWithApp",
    //     // one_signal_id: localStorage.getItem("onesignaluserid"),
    //     // one_signal_id: "test",
    //   });

    //   this.rest.login(ss).subscribe((res: any) => {
    //     console.log("res---", res);
    //   });
    // }
  }
}
