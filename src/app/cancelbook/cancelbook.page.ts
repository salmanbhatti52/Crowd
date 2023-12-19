import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { RestService } from "../rest.service";

@Component({
  selector: "app-cancelbook",
  templateUrl: "./cancelbook.page.html",
  styleUrls: ["./cancelbook.page.scss"],
})
export class CancelbookPage implements OnInit {
  selectedVenue: any = "";
  userdata: any = "";
  userID: any = "";

  constructor(
    public modalCtrl: ModalController,
    public router: Router,
    public rest: RestService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {}

  closeModel() {
    this.modalCtrl.dismiss();
  }

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
  }

  cancelBook() {
    this.selectedVenue = this.rest.detail;

    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_bookings_id: this.rest.selectedBooking.venues_bookings_id,
      status: "Cancelled",
    });

    this.rest.bookings_cancel(ss).subscribe((res: any) => {
      console.log(res);
      if (res.status == "success") {
        this.modalCtrl.dismiss();
        // if (this.rest.comingFrom == "booking2") {
          this.navCtrl.navigateRoot(["home"]);
        // }
      }
    });
  }
  logout() {
    localStorage.clear();
    this.modalCtrl.dismiss();
    this.router.navigate(["login"]);
  }
}
