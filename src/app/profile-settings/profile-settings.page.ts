import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { delay } from 'rxjs';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {

  userdata: any = "";

  uname: any = "";
  firstName: string = "";
  firstNameCopy: string = "";
  lastName: string = "";
  lastNameCopy: string = "";
  email: any = "";

  imgdata: any = "";
  imgdataComing: any = "";
  userid: any = "";
  imageupdate = 0;

  oldpass: any = "";
  newpass: any = "";
  confirmpass: any = "";
  showPass1 = false;
  showPass2 = false;
  showPass3 = false;
  // onesignalid: any = "";
  // social_login_status: any = "";

  // polnum: any = "";

  // seenToggleChecked = false;
  // be_seen = "";
  // beeseenToggleValue = "No";

  // aiToggleChecked = false;
  // ai = "";
  // aiToggleValue = "No";

  // noti: any = "No";
  // adminsList: any;
  // selectedAdmin: any;
  accountType: any;
  socialAccountType: any;
  assetImage = false;
  constructor(public location: Location,
    public router: Router,
    public navCtrl: NavController,
    public rest: RestService,) { }

  ngOnInit() {
    setTimeout(async () => {
      const result = await Camera.checkPermissions();
      console.log("check permsisson result: ", result);
    }, 500);

  }

  ionViewWillEnter() {
    // this.userdata = localStorage.getItem("userdata");
    this.userdata = JSON.parse(localStorage.getItem("userdata")!);
    console.log("userdata----", this.userdata);

    this.email = this.userdata.email;
    const fullName = this.userdata.full_name;
    const nameParts = fullName.trim().split(' ');
    this.firstName = nameParts[0];
    this.firstNameCopy = nameParts[0];
    this.lastName = nameParts.slice(1).join(' ');
    this.lastNameCopy = nameParts.slice(1).join(' ');
    this.uname = this.userdata.username;
    this.userid = this.userdata.users_customers_id;
    this.accountType = this.userdata.account_type
    this.socialAccountType = this.userdata.social_acc_type;

    let parsedProfile = this.userdata.profile_picture;

    if (this.userdata.account_type == "SignupWithApp") {
      if (parsedProfile) {
        this.imgdataComing =
          this.rest.baseURLimg + parsedProfile;
      } else {
        this.imgdataComing = "assets/imgs/icons/new_icons/MyProfileIcon.png";
        this.assetImage = true;
      }
    } else {

      // if (parsedProfile.includes('uploads/')) {
      //   this.imgdataComing =
      //     this.rest.baseURLimg + parsedProfile;
      // } else {
      if (this.userdata.profile_picture) {
        this.imgdataComing = parsedProfile;
      } else {
        this.imgdataComing = "assets/imgs/icons/new_icons/MyProfileIcon.png";
        this.assetImage = true;
      }
      // }

    }

  }

  goBack() {
    this.location.back();
  }

  async save() {

    let isProfileUpdated = false;

    // Check if any profile field has changed
    if (
      this.firstName.trim() !== this.firstNameCopy.trim() || this.lastName.trim() !== this.lastNameCopy.trim() ||
      this.email !== this.userdata.email ||
      this.uname !== this.userdata.username ||
      this.imgdata !== ""
    ) {

      isProfileUpdated = true;
    }

    try {
      if (isProfileUpdated) {
        await this.updateProfile();
      }

    }
    catch (error) {
      console.log(error);
    }

    if (isProfileUpdated) await this.delay(1000);

    if (this.oldpass != "" && this.newpass != "") {
      try {

        await this.changePassword();
      }
      catch (error) {
        console.log(error);
      }

    }

  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.firstName.trim() === "" || this.lastName.trim() === "") {
        this.rest.presentToast("Please enter your full name.");
        return reject("Please enter your full name.");
      }
      if (this.uname == "" || this.uname == null) {
        this.rest.presentToast("Please enter user_name.");
        return reject("Please enter user_name.");

      }
      if (this.email == "" || this.email == null) {
        this.rest.presentToast("Please enter email.");
        return reject("Please enter email.");
      }

      if (!re.test(this.email)) {
        this.rest.presentToast("Enter valid email.");
        return reject("Enter valid email.");
      }

      let fullname = this.firstName.trim() + " " + this.lastName.trim();

      var ss = JSON.stringify({
        users_customers_id: this.userid,
        email: this.email,
        full_name: fullname.trim(),
        username: this.uname,
        profile_picture: this.imgdata,

      });

      this.rest.update_profile(ss).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.status == "success") {
            this.rest.presentToast("Profile updated successfully");
            if (this.imageupdate == 1) {
              // this.rest.profile_updated = true;
            }

            localStorage.setItem("userdata", JSON.stringify(res.data[0]));
            this.ionViewWillEnter();
            return resolve(res);
          } else {
            this.rest.presentToast("Profile update failed.");
            return reject("Error");
          }
        }, error: (err) => {
          console.log(err);
          this.rest.presentToast("Profile update failed.");
          return reject(err);
        }
      });

    });

  }

  preventSpaces(ev: any) {
    console.log(ev);
    if (ev.key === ' ' || ev.code === 'space') {
      ev.preventDefault();
      const message = "Spaces are not allowed in the username.";
      this.rest.presentToast(message);
    }
  }

  async addimg() {
    console.log("addd imge");

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });
    console.log(image);
    this.imgdata = image.base64String;
    this.imgdataComing = "data:image/jpeg;base64," + image.base64String;

    console.log("incoming img----", this.imgdata);
    this.imageupdate = 1;

  }

  changePassword(): Promise<any> {

    return new Promise((resolve, reject) => {

      console.log("oldpass", this.oldpass);
      console.log("newpass", this.newpass);
      console.log("confirmpass", this.confirmpass);

      if (this.confirmpass == "") {
        this.rest.presentToast("Please enter Confirm Password");
        return reject("Please enter Confirm Password");
      }
      if (this.newpass !== this.confirmpass) {
        this.rest.presentToast("New password and confirm password not matched");
        return reject("New password and confirm password not matched");
      }

      var ss = JSON.stringify({
        email: this.email,
        old_password: this.oldpass,
        password: this.newpass,
        confirm_password: this.confirmpass,
      });

      console.log("ss----", ss);

      this.rest.change_password(ss).subscribe({
        next: (res: any) => {
          console.log(res);

          if (res.status == "success") {
            this.rest.presentToast("Password updated successfully.");
            this.goBack();
            return resolve(res);
          } else {
            this.rest.presentToast(res.message);
            return reject(res.message);
          }
        },

        error: (error) => {
          console.error(error);
          this.rest.presentToast("Password change failed.");
          return reject(error);
        }
      });
    });

  }

  togglePass1() {
    this.showPass1 = !this.showPass1;
  }

  togglePass2() {
    this.showPass2 = !this.showPass2;
  }

  togglePass3() {
    this.showPass3 = !this.showPass3;
  }

}
