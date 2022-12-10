import { RestService } from "./../rest.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  email: any = "";
  pass: any = "";
  showPass3 = false;
  constructor(
    public router: Router,
    public rest: RestService,
    public navCtrl: NavController
  ) {}

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
    //this.getSystemSetting();
    //this.router.navigate(["getstart"]);

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
        one_signal_id: localStorage.getItem("onesignaluserid"),
      });

      this.rest.login(ss).subscribe((res: any) => {
        console.log("res---", res);

        this.rest.dismissLoader();

        if (res.status == "success") {
          localStorage.setItem("userdata", JSON.stringify(res.data));
          this.navCtrl.navigateRoot(["home"]);
        } else {
          this.rest.presentToast(res.message);
        }
      });
    }
  }

  getSystemSetting() {
    var ss = JSON.stringify({});

    this.rest.system_setting(ss).subscribe((res: any) => {
      console.log("res---", res);
    });
  }

  togglePass3() {
    this.showPass3 = !this.showPass3;
  }
}
