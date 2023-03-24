import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-paymentsuccess",
  templateUrl: "./paymentsuccess.page.html",
  styleUrls: ["./paymentsuccess.page.scss"],
})
export class PaymentsuccessPage implements OnInit {
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
