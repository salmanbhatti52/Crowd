import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController, NavController } from "@ionic/angular";

@Component({
  selector: "app-splashvideo",
  templateUrl: "./splashvideo.page.html",
  styleUrls: ["./splashvideo.page.scss"],
})
export class SplashvideoPage implements OnInit {
  constructor(
    public router: Router,
    public menuCtrl: MenuController,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    setTimeout(() => {
      if (localStorage.getItem("userdata")) {
        this.navCtrl.navigateRoot(["/getstart"]);
      } else {
        this.navCtrl.navigateRoot(["/start"]);
      }
    }, 10000);
  }
  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menuCtrl.enable(true);
  }
  gotoSignIn() {
    this.navCtrl.navigateRoot(["/sign-in-screen"]);
  }
}
