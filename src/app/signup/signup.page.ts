import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { RestService } from "../rest.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  email: any = "";
  pass: any = "";
  constructor(
    public router: Router,
    public rest: RestService,
    public navCtrl: NavController
  ) {}

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
      this.rest.presentLoader();
      var ss = JSON.stringify({
        email: this.email,
        password: this.pass,
        account_type: "SignupWithApp",
        one_signal_id: localStorage.getItem("onesignaluserid"),
      });

      this.rest.signup(ss).subscribe((res: any) => {
        console.log(res);

        this.rest.dismissLoader();

        if (res.status == "success") {
          localStorage.setItem("userdata", JSON.stringify(res.data[0]));
          this.navCtrl.navigateRoot(["login"]);
        } else {
          this.rest.presentToast(res.message);
        }
      });
    }
  }
}
