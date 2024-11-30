import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";

@Component({
  selector: "app-splashvideo",
  templateUrl: "./splashvideo.page.html",
  styleUrls: ["./splashvideo.page.scss"],
})
export class SplashvideoPage implements OnInit {
  constructor(
    public menuCtrl: MenuController,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    console.log("video");

    setTimeout(() => {
      if (localStorage.getItem("userdata")) {
        if (localStorage.getItem("location")) {
          this.navCtrl.navigateRoot(["/home"]);
        } else {
          this.navCtrl.navigateRoot(["/getstart"]);
        }
      } else {
        this.navCtrl.navigateRoot(["/start"]);
      }
    }, 2000);
  }
  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    // this.menuCtrl.enable(true);
  }
  gotoSignIn() {
    this.navCtrl.navigateRoot(["/sign-in-screen"]);
  }
}
