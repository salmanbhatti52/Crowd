import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {
  
  userdata: any = "";
  
  uname: any = "";
  firstName: any = "";
  lastName: any = "";
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
  assetImage= false;
  constructor(public location: Location,
    public router: Router,
    public navCtrl: NavController,
    public rest: RestService,) { }

    ngOnInit() {
      setTimeout(async () => {
        const result = await Camera.checkPermissions();
        console.log("check permsisson result: ",result);
      }, 500);
  
    }

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);

    this.email = JSON.parse(this.userdata).email;
    const fullName = JSON.parse(this.userdata).full_name;
    const nameParts = fullName.trim().split(' ');
    this.firstName = nameParts[0];
    this.lastName = nameParts.slice(1).join(' ');
    this.uname = JSON.parse(this.userdata).username;
    this.userid = JSON.parse(this.userdata).users_customers_id;
    this.accountType = JSON.parse(this.userdata).account_type
    this.socialAccountType = JSON.parse(this.userdata).social_acc_type;
    if(JSON.parse(this.userdata).account_type == "SignupWithApp"){
      if (JSON.parse(this.userdata).profile_picture) {
        this.imgdataComing =
          this.rest.baseURLimg + JSON.parse(this.userdata).profile_picture;
      } else {
        this.imgdataComing = "assets/imgs/icons/new_icons/MyProfileIcon.png";
        this.assetImage = true;
      }
    }else{
      let str = JSON.parse(this.userdata).profile_picture
      if(str.includes('uploads/')){
        this.imgdataComing =
        this.rest.baseURLimg + JSON.parse(this.userdata).profile_picture;
      }else{
        if (JSON.parse(this.userdata).profile_picture) {
          this.imgdataComing = JSON.parse(this.userdata).profile_picture;
        } else {
          this.imgdataComing = "assets/imgs/icons/new_icons/MyProfileIcon.png";
          this.assetImage = true;
        }
      }
      
    }
    
  }

  goBack() {
    this.location.back();
  }

  preventSpaces(ev:any){
    console.log(ev);
    if(ev.key === ' ' || ev.code === 'space'){
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

  submit() {
    console.log("oldpass", this.oldpass);
    console.log("newpass", this.newpass);
    console.log("confirmpass", this.confirmpass);
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);

    var email = JSON.parse(this.userdata).email;
    console.log("email----", email);

    if (this.oldpass == "") {
      this.rest.presentToast("Please enter Old Password");
    } else if (this.newpass == "") {
      this.rest.presentToast("Please enter New Password");
    } else if (this.confirmpass == "") {
      this.rest.presentToast("Please enter Confirm Password");
    } else if (this.newpass == this.confirmpass) {
      var ss = JSON.stringify({
        email: email,
        old_password: this.oldpass,
        password: this.newpass,
        confirm_password: this.confirmpass,
      });

      console.log("ss----", ss);

      this.rest.change_password(ss).subscribe((res: any) => {
        console.log(res);

        if (res.status == "success") {
          this.rest.presentToast("Password updated successfully.");
        } else {
          this.rest.presentToast(res.message);
        }
      });
    } else {
      this.rest.presentToast("New password and confirm password not matched");
    }
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
