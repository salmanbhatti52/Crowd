import { HttpClient } from "@angular/common/http";
import { RestService } from "./../rest.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
@Component({
  selector: "app-loginevent",
  templateUrl: "./loginevent.page.html",
  styleUrls: ["./loginevent.page.scss"],
})
export class LogineventPage implements OnInit {
  email: any = "";
  pass: any = "";
  showPass3 = false;
  fbUserData: any;
  token: any;
  fbuser: any = "";
  googleUser: any = "";
  platformcheck: any = "android";
  social_login_status: any = "No";
  constructor(
    public router: Router,
    public rest: RestService,
    public navCtrl: NavController,
    public platform: Platform,
    public http: HttpClient
  ) {
    this.social_login_status = localStorage.getItem("social_login_status");
    console.log("login----social_login_status---", this.social_login_status);

    if (this.platform.is("ios")) {
      this.platformcheck = "ios";
    } else {
      this.platformcheck = "android";
    }
  }

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

    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(this.email)) {
      this.rest.presentToast("Enter valid email.");
    } else if (this.email == "") {
      this.rest.presentToast("Please enter valid email.");
    } else if (this.pass == "") {
      this.rest.presentToast("Please enter password.");
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
          if (localStorage.getItem("location")) {
            this.navCtrl.navigateRoot(["/home"]);
          } else {
            this.navCtrl.navigateRoot(["/getstart"]);
          }
        } else {
          this.rest.presentToast(res.message);
        }
      });
    }
  }

  getSystemSetting() {
    this.rest.system_settings().subscribe((res: any) => {
      console.log("res---system_settings----", res);
    });
  }

  togglePass3() {
    this.showPass3 = !this.showPass3;
  }
}
