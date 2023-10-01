import { RestService } from "./rest.service";
import { Component } from "@angular/core";
// import { OneSignal } from "@awesome-cordova-plugins/onesignal/ngx";
import { Platform } from "@ionic/angular";

import OneSignal from "onesignal-cordova-plugin"; 
// import { LottieSplashScreen } from "@awesome-cordova-plugins/lottie-splash-screen/ngx";
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  oneSignalAppId = "dbcd73be-ee2e-42b8-a165-146f91116f0b";
  oneSignalFirebaseId = "46465632729";
  identy: any = "";

  constructor(
    public platform: Platform, // public lottieSplashScreen: LottieSplashScreen
    public rest: RestService
  ) {
    this.platform.ready().then(() => {
      this.initializeApp();
      this.showsplash();
    });
    this.rest.system_settings().subscribe((res: any) => {
      console.log("system_settings----", res);

      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].type == "social_login") {
          console.log("res.data[i].description---", res.data[i].description);
          localStorage.setItem("social_login_status", res.data[i].description);
        }
        if (res.data[i].type == "records_limit") {
          console.log("res.data[i].records_limit---", res.data[i].description);
          localStorage.setItem("records_limit", res.data[i].description);
        }
      }
    });
  }

  async showsplash() {
    await this.platform.ready();

    // this.lottieSplashScreen.show("assets/lottiscreen.json", false, 1024, 768);
    const lottie = (window as any).lottie;
    if (this.platform.is("ios") && lottie) {
      await lottie.hoide();
      await lottie.show("public/assets/lottiscreen.json", false);
    }
  }

  initializeApp() {
    // this.lottieSplashScreen.show(
    //   "assets/imgs/lottiscreen.json",
    //   false,
    //   1024,
    //   768
    // );

    // setTimeout(() => {
    //   this.lottieSplashScreen.hide();
    // }, 5000);

    // if (this.userid == '' || this.userid == null) {
    //   this.navCtrl.navigateRoot('signin');
    // } else {
    //   this.navCtrl.navigateRoot('home/tabs/home2');
    // }
    this.pushNotification();
  }
  pushNotification() {
    console.log("push notification in function.....");
    OneSignal.setAppId("dbcd73be-ee2e-42b8-a165-146f91116f0b");
    OneSignal.setNotificationOpenedHandler(function (jsonData) {
      console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
    });

    OneSignal.promptForPushNotificationsWithUserResponse((accepted) => {
      console.log("promptForPushNotificationsWithUserResponse: " + accepted);
    });

    OneSignal.addSubscriptionObserver(async (event: any) => {
      console.log("OneSignal: subscription changed:", event);
      localStorage.setItem("onesignaluserid", event.userId);
      //if (event.to.isSubscribed) {
      await OneSignal.getDeviceState((res) => {
        console.log("AppToken---------", res.userId);
        localStorage.setItem("onesignaluserid", res.userId);
      });
      //}
    });
    // this.oneSignal.startInit(this.oneSignalAppId, this.sender_id);

    // this.oneSignal.inFocusDisplaying(
    //   this.oneSignal.OSInFocusDisplayOption.Notification
    // );

    // this.oneSignal.handleNotificationReceived().subscribe((data) => {
    //   console.log('data load', data.payload);
    // });

    // this.oneSignal.handleNotificationOpened().subscribe((data) => {
    //   console.log('data open notification', data);

    //   if (data.notification.payload.additionalData.type === 'requestsending') {

    //     this.ngZone.run(() => this.router.navigate(['requests1']));

    //   }

    //   if (data.notification.payload.additionalData.type === 'requestrejection') {
    //     // this.router.navigate(['requests']);
    //     this.ngZone.run(() => this.router.navigate(['requests']));
    //   }

    //   if (data.notification.payload.additionalData.type === 'requestacceptance') {

    //     // this.router.navigate(['requests']);
    //     this.ngZone.run(() => this.router.navigate(['requests']));

    //   }

    //   if (data.notification.payload.additionalData.type === 'paymentConfirmation') {

    //     // this.router.navigate(['earning']);
    //     this.ngZone.run(() => this.router.navigate(['earning']));

    //   }
    //   if (data.notification.payload.additionalData.type === 'messageNotification') {

    //     // this.router.navigate(['inbox']);
    //     this.ngZone.run(() => this.router.navigate(['chat']));

    //   }
    // });

    // this.oneSignal.endInit();
  }
}
