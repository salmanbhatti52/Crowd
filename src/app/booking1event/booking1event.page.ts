import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";

@Component({
  selector: "app-booking1event",
  templateUrl: "./booking1event.page.html",
  styleUrls: ["./booking1event.page.scss"],
})
export class Booking1eventPage implements OnInit {
  userId:any;
  userdata: any = "";
  visitorArr: any = "";
  selectedVenue: any = "";
  latitude: any;
  longitude: string | null | undefined;
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform
  ) {}

  ionViewWillEnter() {
    this.userdata = localStorage.getItem('userdata');
    this.userId = JSON.parse(this.userdata).users_customers_id;
    this.latitude = localStorage.getItem('lattitude');
    this.longitude = localStorage.getItem('longitude');

    this.selectedVenue = this.rest.detail;
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  gotoOrganizerEvents(){
    this.rest.orgEventsArr = [];
    let data = {
      users_business_id:this.selectedVenue.users_business_id,
      users_customers_id:this.userId,
      longitude:this.longitude,
      lattitude:this.latitude,
      page_number:"1"
    }
    console.log("Api dataa: ",data);
    this.rest.presentLoader();
    this.rest.sendRequest('get_business_events',data).subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Org events REssssss: ",res);
      
      this.rest.orgEventsArr = res.data;
      this.router.navigate(['/organizer-events']);
      
    },(err)=>{
      this.rest.dismissLoader();
      console.log("errrr: ",err);
      
    })
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }

  async cancelBooking() {
    console.log("model");
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });

    await modal.present();
  }
  dismissModal(){
    this.modalCtrl.dismiss();
  }
  goToChat() {
    this.router.navigate(["chat"]);
  }

  openBrowserLink() {
    console.log("opennnnn");

    this.iab.create(this.selectedVenue.website, "_blank");
  }

  public goLocation() {
    // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    var geocoords =
      this.selectedVenue.lattitude + "," + this.selectedVenue.longitude;

    if (this.platform.is("ios")) {
      window.open("maps://?q=" + geocoords, "_system");
    } else {
      var label = encodeURI(this.selectedVenue.location); // encode the label!
      window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");

      // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    }
  }

  buyTicket() {
    console.log("buy");
    this.router.navigate(["booking2event"]);
  }
}
