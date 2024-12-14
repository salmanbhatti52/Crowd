import { ModalController, NavController } from "@ionic/angular";
import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parse, parseISO } from "date-fns";

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
  userdata: any = "";
  visitorArr: any = "";
  selectedVenue: any = "";
  selectedBooking: any = "";

  mdate: any = "";
  mtime: any = "";
  userID: any = "";
  startChatStatus: any;
  isTestingModalOpen: boolean = false;

  bookingCancelled=false;

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
    if(this.selectedVenue.cover_image){
      this.selectedVenue.cover_images = this.selectedVenue?.cover_image;
    }
    this.selectedBooking = this.rest.selectedBooking;
    console.log(this.selectedBooking);
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.mdate = format(new Date(this.selectedBooking.bookings_date) ,"E, do MMM");
    console.log("this.mdate Fff", this.mdate);

    this.mtime = parse(this.selectedBooking.bookings_time, 'HH:mm:ss', new Date());
    this.mtime = format(this.mtime, 'h:mma');
    // this.mtime = this.selectedBooking.bookings_time.substring(0,5);
    console.log("this.selectedBooking.bookings_time", this.mtime);
    
    this.isTestingModalOpen = true; // show modal with info
    this.startChat();
  }

  viewBooking(){

  }

  closeModal(){
    this.isTestingModalOpen = false;
    this.gotoReservations();
  }

  closeNewModel(){
    this.bookingCancelled = false;
    this.changeDetectorRef.detectChanges();
    this.navCtrl.navigateRoot(["home"]);
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

  goToProfile() {
    this.router.navigate(["profile"]);
  }

  async cancelBooking() {
    console.log("model");
    // this.rest.comingFrom = "booking2";
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });

    await modal.present();
    const {data, role} = await modal.onDidDismiss();
    if(role == 'cancelBooking' && data == 'cancelled'){
       this.bookingCancelled = true;
    }
  }

  startChat(){
    var ss = JSON.stringify({
      requestType: "startChat",
      users_customers_id: this.userID,
      other_users_customers_id: this.selectedVenue.users_business_id,
      venues_id: this.selectedVenue.venues_id,
    });
    console.log("start chat payload", ss);
    
    this.rest.user_chat(ss).subscribe((res: any) => {
      console.log(res);
      if (res.status == "success"){
        this.startChatStatus = 'success';
      }
    });
  }

  goToChat() {
    if(this.startChatStatus == 'success'){
      this.router.navigate(["chat"])
    }
  }

  openBrowserLink() {
    console.log("opennnnn");

    this.iab.create(this.selectedVenue.website, "_blank");
  }

  editbooking() {
    this.router.navigate(["editbooking"]);
  }
}
