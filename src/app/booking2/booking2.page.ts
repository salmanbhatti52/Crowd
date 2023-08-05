import { ModalController, NavController } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parseISO } from "date-fns";


@Component({
  selector: "app-booking2",
  templateUrl: "./booking2.page.html",
  styleUrls: ["./booking2.page.scss"],
})
export class Booking2Page implements OnInit {
  userdata: any = "";
  visitorArr: any = "";
  selectedVenue: any = "";
  selectedBooking: any = "";

  mdate: any = "";
  mtime: any = "";
  userID: any = "";

  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public navCtrl:NavController
  ) {}

  ionViewWillLeave() {
    this.rest.claimedVenDiscount = false;
  }
  ionViewWillEnter() {
    this.selectedVenue = this.rest.detail;
    // if(this.selectedVenue == ""){
    //   this.selectedVenue = this.rest.selectedBooking.venues_details;
    // }
    this.selectedBooking = this.rest.selectedBooking;
    console.log(this.selectedBooking);
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.mdate = format(parseISO(new Date(this.selectedBooking.bookings_date).toISOString()) ,"MMM dd yyyy");
    console.log("this.mdate Fff", this.mdate);

    this.mtime = this.selectedBooking.bookings_time.substring(0,5);
    console.log("this.selectedBooking.bookings_time", this.mtime);
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  gotoReservations(){
    this.rest.comfrom = 'booking2';
    // this.router.navigate(['/myreservations']);
    this.navCtrl.navigateRoot('myreservations');
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }

  async cancelBooking() {
    console.log("model");
    this.rest.comingFrom = "booking2";
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });

    await modal.present();
  }

  goToChat() {
    var ss = JSON.stringify({
      requestType: "startChat",
      users_customers_id: this.userID,
      other_users_customers_id: this.selectedVenue.users_business_id,
      venues_id: this.selectedVenue.venues_id,
    });
    console.log("start chat payload", ss);
    
    this.rest.user_chat(ss).subscribe((res: any) => {
      console.log(res);
      if (res.status == "success") this.router.navigate(["chat"]);
    });
  }

  openBrowserLink() {
    console.log("opennnnn");

    this.iab.create(this.selectedVenue.website, "_blank");
  }

  editbooking() {
    this.router.navigate(["editbooking"]);
  }
}
