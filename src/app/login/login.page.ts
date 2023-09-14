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
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  email: any = "";
  pass: any = "";
  showPass3 = false;
  fbUserData: any;
  appleUserData:any;
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

    this.initializeApp();
    if (this.platform.is("ios")) {
      this.platformcheck = "ios";
    } else {
      this.platformcheck = "android";
    }
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

    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(this.email)) {
      this.rest.presentToast("Enter valid email.");
    } else if (this.email == "") {
      this.rest.presentToast("Please enter valid email.");
    } else if (this.pass == "") {
      this.rest.presentToast("Please enter password.");
    } else {
      this.rest.presentLoaderWd();
      var ss = {
        email: this.email,
        password: this.pass,
        // one_signal_id: localStorage.getItem("onesignaluserid"),
      };

      console.log("signin_payload",ss);
      

      this.rest.login(JSON.stringify(ss)).subscribe((res: any) => {
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

  async googleSignIn() {

    this.rest.presentToast('Accessing Your Google Account');
    await GoogleAuth.signIn().then((res:any)=>{
      // this.api.hideLoading();
      this.rest.presentToast('Google Account Identified');
      console.log('GoogleUserResponse: ',res);
      this.googleUser = res;
    },(err)=>{
      // this.api.hideLoading();
      this.rest.presentToast(err);
      console.log("Error: ",err);
      
    });
    console.log('GoogleUserResponse: ',this.googleUser);

    // this.googleUser = await GoogleAuth.signIn();
    // console.log("googleUser-------", this.googleUser);

    var ss = {
      email: this.googleUser.email,
      one_signal_id: localStorage.getItem("onesignaluserid"),
      google_access_token: this.googleUser.authentication.accessToken,
      account_type: "SignupWithSocial",
      social_acc_type: "Google",
      password: "dummy",
      status: "Active",
      verify_code: "dummy",
      social_username: this.googleUser.displayName,
      social_profile: this.googleUser.imageUrl,
    };

    console.log("Google_signin_payload---", ss);

    this.rest.presentLoader();

    this.rest.users_customers_signup_social(JSON.stringify(ss)).subscribe((res: any) => {
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
    const FACEBOOK_PERMISSIONS = [
      "email", 
      "user_birthday",
      'user_photos',
      'user_gender'
    ];
    this.rest.presentToast('Accessing Your Facebook Account');
    await (<FacebookLoginResponse><unknown>(
      FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }).then((res:any)=>{
        
        const result = res;
        console.log("Result: ",result);

        if(result.accessToken && result.accessToken.userId){
          this.token = result.accessToken;
          //Login Successful.
          this.rest.presentToast('Facebook Account Identified');
          console.log(`Facebook access token is ${result.accessToken.token}`);  
          this.loadUserData();    
        }

      },(err)=>{
        console.log("Error: ",err);
        this.rest.presentToast(err);
        
      })
    ));
    
  }     

  async loadUserData() {
    const url = 'https://graph.facebook.com/'+this.token.userId+'?fields=id,name,picture.width(720),birthday,email&access_token='+this.token.token;
    this.rest.presentLoader();
    this.http.post(url, {}, {}).subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log('Response: ' ,res);
      this.fbuser = res;
      
      let ss={
        email: this.fbuser.email,
        one_signal_id: localStorage.getItem("onesignaluserid"),
        google_access_token: this.fbuser.id,
        account_type: "SignupWithSocial",
        social_acc_type: "Facebook",
        password: "dummy",
        status: "Active",
        verify_code: "dummy",
        social_username: res.name,
        social_profile: res.picture.data.url
      }
      if(ss.email == undefined){
        ss.email = "dummy@email.com" 
      }
      //remove it later-----------------------
      console.log("Facebook_signin_payload: ",ss);

      this.rest.presentLoader();

      this.rest.users_customers_signup_social(JSON.stringify(ss)).subscribe((res: any) => {
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
      },(err)=>{
        this.rest.dismissLoader();
        console.log("Error: ",err);
        this.rest.presentToast(err);
      });
      
      
    },(err)=>{
      this.rest.dismissLoader();
      console.log("Error: ",err);
      this.rest.presentToast(err);
    })    
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
        this.appleUserData = res;
     

        console.log("AppleSigninPluginRes--------------", this.appleUserData);

        var ss = {
          email: this.appleUserData.email,
          one_signal_id: localStorage.getItem("onesignaluserid"),
          google_access_token: this.appleUserData.identityToken,
          account_type: "SignupWithSocial",
          social_acc_type: "Apple",
          password: "dummy",
          status: "Active",
          verify_code: "dummy",
        };

        if (ss.email == undefined || ss.email == "") {
          ss.email = "dummyemail@gmail.com";
        }

        console.log("AppleSignInPayload==========", ss);

        this.rest.presentLoader();

        this.rest.users_customers_signup_social(JSON.stringify(ss)).subscribe((res: any) => {
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

  EventLogin() {
    this.router.navigate(["loginevent"]);
  }
}
