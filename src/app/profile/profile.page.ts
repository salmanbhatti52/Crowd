import { BeseenPage } from "./../beseen/beseen.page";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { RestService } from "../rest.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  userdata: any = "";
  noti: any = "No";
  uname: any = "";
  name: any = "";
  email: any = "";

  imgdata: any = "";
  imgdataComing: any = "";
  userid: any = "";
  imageupdate = 0;
  onesignalid: any = "";
  social_login_status: any = "";

  polnum: any = "";
  seenToggleChecked = false;
  be_seen = "";

  beeseenToggleValue = "No";

  constructor(
    public location: Location,
    public router: Router,
    public navCtrl: NavController,
    public rest: RestService,
    public modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);
    console.log(
      "userdJSON.parse(this.userdata).profile_pictureata----",
      JSON.parse(this.userdata).profile_picture
    );

    this.email = JSON.parse(this.userdata).email;
    this.name = JSON.parse(this.userdata).full_name;
    this.uname = JSON.parse(this.userdata).username;
    this.userid = JSON.parse(this.userdata).users_customers_id;
    if (JSON.parse(this.userdata).profile_picture) {
      this.imgdataComing =
        this.rest.baseURLimg + JSON.parse(this.userdata).profile_picture;
    } else {
      this.imgdataComing = "assets/imgs/addimg.svg";
    }

    this.be_seen = JSON.parse(this.userdata).be_seen;

    if (this.be_seen == "No") {
      this.seenToggleChecked = false;
    } else {
      this.seenToggleChecked = true;
      this.beeseenToggleValue = "Yes";
    }

    console.log("email----", this.email);
  }
  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  gotoEvents(){
    this.router.navigate(["my-events"]);
  }

  gotoAddPaymentMethods(){
    this.router.navigate(["payment-methods"]);
  }

  gotoRefundPage(){
    this.router.navigate(["my-refunds"]);
  }

  changePass() {
    this.router.navigate(["changepass"]);
  }
  goLogout() {
    this.onesignalid = localStorage.getItem("onesignaluserid");
    this.social_login_status = localStorage.getItem("social_login_status");

    localStorage.clear();
    localStorage.setItem("onesignaluserid", this.onesignalid);
    localStorage.setItem("social_login_status", this.social_login_status);
    this.navCtrl.navigateRoot(["login"]);
  }

  godelete() {
    this.router.navigate(["deletact"]);
  }

  notitoggle(event: any) {
    console.log(event.detail.checked);

    if (event.detail.checked) {
      this.noti = "Yes";
      localStorage.removeItem("location");
      this.navCtrl.navigateRoot(["/getstart"]);
    } else {
      this.noti = "No";
    }

    console.log(this.noti);
  }

  beseentoggle(event: any) {
    console.log(event.detail.checked);

    if (event.detail.checked) {
      if (this.be_seen == "No") {
        this.showPoint();
      }

      this.beeseenToggleValue = "Yes";
    } else {
      this.be_seen = "No";
      this.beeseenToggleValue = "No";
    }
  }

  async showPoint() {
    console.log("model");
    const modal = await this.modalCtrl.create({
      component: BeseenPage,
      cssClass: "riz",
    });

    await modal.present();
  }

  save() {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.uname == "" || this.uname == null) {
      this.rest.presentToast("Please enter user name.");
    } else if (this.name == "" || this.name == null) {
      this.rest.presentToast("Please enter name.");
    } else if (this.email == "" || this.email == null) {
      this.rest.presentToast("Please enter email.");
    } else if (!re.test(this.email)) {
      this.rest.presentToast("Enter valid email.");
    } else {
      var ss = JSON.stringify({
        users_customers_id: this.userid,
        email: this.email,
        full_name: this.name,
        username: this.uname,
        notifications: "Yes",
        profile_picture: this.imgdata,
        be_seen: this.beeseenToggleValue,
      });

      this.rest.update_profile(ss).subscribe((res: any) => {
        console.log(res);
        if (res.status == "success") {
          this.rest.presentToast("Profile updated successfully");

          localStorage.setItem("userdata", JSON.stringify(res.data[0]));
        } else {
          this.rest.presentToast("Error");
        }
      });
    }
    console.log("save");
  }

  async addimg() {
    console.log("addd imge");

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });
    console.log(image);
    this.imgdata = image.base64String;
    this.imgdataComing = "data:image/jpeg;base64," + image.base64String;

    console.log("incoming img----", this.imgdata);
    this.imageupdate = 1;
    // Can be set to the src of an image now
  }

  gotoReservation(){
    this.router.navigate(['myreservations'])
  }
}
