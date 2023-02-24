import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-beseen",
  templateUrl: "./beseen.page.html",
  styleUrls: ["./beseen.page.scss"],
})
export class BeseenPage implements OnInit {
  constructor(public modalCtrl: ModalController, public router: Router) {}

  ngOnInit() {}

  closeModel() {
    this.modalCtrl.dismiss();
  }

  logout() {
    localStorage.clear();
    this.modalCtrl.dismiss();
    this.router.navigate(["login"]);
  }
}
