import { HttpClient } from "@angular/common/http";
import { RestService } from "./../rest.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { FacebookLogin } from "@capacitor-community/facebook-login";
import { FacebookLoginResponse } from "@capacitor-community/facebook-login";
import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from "@capacitor-community/apple-sign-in";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  email: any = "";
  pass: any = "";
  showPass3 = false;
  fbUserData: any;
  token: any;
  fbuser: any = "";
  googleUser: any = "";
  constructor(
    public router: Router,
    public rest: RestService,
    public navCtrl: NavController,
    public platform: Platform,
    public http: HttpClient
  ) {
    this.initializeApp();
  }

  ngOnInit() {}

  async initializeApp() {
    this.platform.ready().then(async () => {
      GoogleAuth.initialize();
      await FacebookLogin.initialize({ appId: "828272794912378" });
    });
  }
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
    var ss = JSON.stringify({});

    this.rest.system_setting(ss).subscribe((res: any) => {
      console.log("res---", res);
    });
  }

  togglePass3() {
    this.showPass3 = !this.showPass3;
  }

  async googleSignIn() {
    this.googleUser = await GoogleAuth.signIn();
    console.log("googleUser-------", this.googleUser);

    var ss = JSON.stringify({
      email: this.googleUser.email,
      one_signal_id: localStorage.getItem("onesignaluserid"),
      google_access_token: this.googleUser.authentication.accessToken,
      account_type: "SignupWithSocial",
      social_acc_type: "Google",
      password: "dummy",
      status: "Active",
      verify_code: "dummy",
    });

    console.log("googlesignup---------", ss);

    this.rest.presentLoader();

    this.rest.users_customers_signup_social(ss).subscribe((res: any) => {
      console.log(res);

      this.rest.dismissLoader();
      if (res.status == "success") {
        localStorage.setItem("userdata", JSON.stringify(res.data[0]));
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

  async fbLogin() {
    const FACEBOOK_PERMISSIONS = ["email", "user_birthday"];
    // var result = await (<FacebookLoginResponse>(
    //   (<unknown>FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }))
    // ));

    const result = await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    if (result.accessToken) {
      this.token = result.accessToken;

      this.loadUserData();
      // Login successful.
      console.log(`Facebook access token is ${result.accessToken.token}`);
    }
    console.log("fbLogin()-------", result);
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe((res) => {
      console.log("fb login====", res);

      this.fbuser = res;

      console.log("fbUser--------------", this.fbuser);

      var ss = {
        email: this.fbuser.email,
        one_signal_id: localStorage.getItem("onesignaluserid"),
        google_access_token: this.fbuser.id,
        account_type: "SignupWithSocial",
        social_acc_type: "Facebook",
        password: "dummy",
        status: "Active",
        verify_code: "dummy",
      };

      if (ss.email == undefined) {
        ss.email = "dummyemail@gmail.com";
      }

      var s2 = JSON.stringify(ss);

      console.log("googlesignup---------", ss);

      this.rest.presentLoader();

      this.rest.users_customers_signup_social(s2).subscribe((res: any) => {
        console.log(res);

        this.rest.dismissLoader();
        if (res.status == "success") {
          localStorage.setItem("userdata", JSON.stringify(res.data[0]));
          if (localStorage.getItem("location")) {
            this.navCtrl.navigateRoot(["/home"]);
          } else {
            this.navCtrl.navigateRoot(["/getstart"]);
          }
        } else {
          this.rest.presentToast(res.message);
        }
      });
    });
  }

  signinwithapple() {
    console.log("signinwithapple");
    alert("signinwithapple");

    let options: SignInWithAppleOptions = {
      clientId: "com.microwd.app",
      redirectURI: "https://www.yourfrontend.com/login",
      scopes: "email name",
      state: "12345",
      nonce: "nonce",
    };

    SignInWithApple.authorize(options)
      .then((result: SignInWithAppleResponse) => {
        console.log(result);
        alert(result);
        alert(JSON.stringify(result));

        // Handle user information
        // Validate token with server and create new session
      })
      .catch((error) => {
        // Handle error
      });
  }
}
