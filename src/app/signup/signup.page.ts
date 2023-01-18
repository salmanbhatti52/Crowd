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
  AppleSignInResponse,
  AppleSignInErrorResponse,
  ASAuthorizationAppleIDRequest,
} from "@awesome-cordova-plugins/sign-in-with-apple/ngx";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
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
    public http: HttpClient,
    public signInWithApple: SignInWithApple
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
  goToLogin() {
    this.router.navigate(["login"]);
  }

  submit() {
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
        account_type: "SignupWithApp",
        one_signal_id: localStorage.getItem("onesignaluserid"),
      });

      this.rest.signup(ss).subscribe((res: any) => {
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
  }

  togglePass3() {
    this.showPass3 = !this.showPass3;
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
  signinwithapple() {
    this.signInWithApple
      .signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail,
        ],
      })
      .then((res: AppleSignInResponse) => {
        // https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
        // alert("AppleSignInResponse-----: " + res);
        // alert("Send token to apple for verification----: " + res.identityToken);
        console.log(res);
        this.fbuser = res;

        console.log("Apple User--------------", this.fbuser);

        var ss = {
          email: this.fbuser.email,
          one_signal_id: localStorage.getItem("onesignaluserid"),
          google_access_token: this.fbuser.identityToken,
          account_type: "SignupWithSocial",
          social_acc_type: "Apple",
          password: "dummy",
          status: "Active",
          verify_code: "dummy",
        };

        if (ss.email == undefined || ss.email == "") {
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
      })
      .catch((error: AppleSignInErrorResponse) => {
        // alert(error.code + " " + error.localizedDescription);
        // console.error(error);
      });
  }
}
