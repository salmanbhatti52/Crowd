import { ModalController, NavController } from "@ionic/angular";
import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parse, parseISO } from "date-fns";


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
  startChatStatus: any;
  showBookingModel: boolean = false;

  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public navCtrl:NavController,
    public changeDetectorRef:ChangeDetectorRef
  ) {}

  ionViewWillLeave() {
    this.rest.claimedVenDiscount = false;
  }
  ionViewWillEnter() {
    this.selectedVenue = this.rest.detail;
    
    this.selectedBooking = this.rest.selectedBooking;
    console.log(this.selectedBooking);
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.mdate = format(new Date(this.selectedBooking.bookings_date) ,"E, dd MMM");
    console.log("this.mdate Fff", this.mdate);

    this.mtime = parse(this.selectedBooking.bookings_time, 'HH:mm:ss', new Date());
    this.mtime = format(this.mtime, 'h:mma');
    // this.mtime = this.selectedBooking.bookings_time.substring(0,5);
    console.log("this.selectedBooking.bookings_time", this.mtime);
    
    this.showBookingModel = true; // show modal with info
    // this.startChat();
  }

  viewBooking(){
    // this.rest.comfrom = 'booking2';
    this.showBookingModel = false;
    this.changeDetectorRef.detectChanges();
    this.navCtrl.navigateRoot('booking-detail');
  }

  closeModal(){
    this.showBookingModel = false;
    this.changeDetectorRef.detectChanges();
    this.gotoReservations();
  }


  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  gotoReservations(){
    this.rest.comfrom = 'booking2';
    this.navCtrl.navigateRoot('myreservations');
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }
 
}
