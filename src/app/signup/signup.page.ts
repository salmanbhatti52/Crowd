import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  email: any = "";
  pass: any = "";
  constructor(public router: Router, public rest: RestService) {}

  ngOnInit() {}
  goToLogin() {
    this.router.navigate(["login"]);
  }

  submit() {
    if (this.email == "") {
      this.rest.presentToast("Please enter valid email.");
    }

    if (this.pass == "") {
      this.rest.presentToast("Please enter password.");
    }

    if (this.email == "" || this.pass == "") {
      this.rest.presentToast("Please enter required fields.");
    } else {
      var ss = JSON.stringify({
        email: this.email,
        password: this.pass,
        account_type: "SignupWithApp",
        // one_signal_id: localStorage.getItem("onesignaluserid"),
        one_signal_id: "test",
      });

      this.rest.signup(ss).subscribe((res: any) => {
        console.log("res---", res);
      });
    }
  }
}
