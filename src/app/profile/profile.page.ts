import { BeseenPage } from "./../beseen/beseen.page";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { RestService } from "../rest.service";
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { AlertController } from '@ionic/angular';
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { FacebookLogin } from "@capacitor-community/facebook-login";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  handlerMessage = '';
  roleMessage = '';

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
  adminsList: any;
  selectedAdmin: any;
  accountType: any;
  socialAccountType: any;

  constructor(
    public location: Location,
    public router: Router,
    public navCtrl: NavController,
    public rest: RestService,
    public modalCtrl: ModalController,
    // private camera: Camera,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);

    this.email = JSON.parse(this.userdata).email;
    this.name = JSON.parse(this.userdata).full_name;
    this.uname = JSON.parse(this.userdata).username;
    this.userid = JSON.parse(this.userdata).users_customers_id;
    this.accountType = JSON.parse(this.userdata).account_type
    this.socialAccountType = JSON.parse(this.userdata).social_acc_type;
    if(JSON.parse(this.userdata).account_type == "SignupWithApp"){
      if (JSON.parse(this.userdata).profile_picture) {
        this.imgdataComing =
          this.rest.baseURLimg + JSON.parse(this.userdata).profile_picture;
      } else {
        this.imgdataComing = "assets/imgs/addimg.svg";
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
          this.imgdataComing = "assets/imgs/addimg.svg";
        }
      }
      
    }
    

    this.be_seen = JSON.parse(this.userdata).be_seen;

    if (this.be_seen == "No") {
      this.seenToggleChecked = false;
    } else {
      this.seenToggleChecked = true;
      this.beeseenToggleValue = "Yes";
    }

    this.getAdminsList();
    this.getAllChatLive();

    
  }
  ngOnInit() {
    setTimeout(async () => {
      const result = await Camera.checkPermissions();
      console.log("check permsisson result: ",result);
    }, 500);

  }

  getAdminsList(){
    let data = { 
      users_customers_id: this.userid 
    };
    this.rest.sendRequest('get_admin_list',data).subscribe((res:any)=>{
      console.log("Get Admin List Ress: ",res);
      if(res.status == 'success'){
        this.adminsList = res.data;
        console.log("adminsList: ",this.adminsList);  
      }
      
      
    })
  }

  getAllChatLive(){
    let data ={
      users_customers_id: this.userid
    }
    this.rest.sendRequest("getAllChatLive",data).subscribe((res:any)=>{
      console.log("getAllChatLive Resposne: ",res);
      if(res.status == 'success'){
        if(res.data.length > 0){
          this.rest.adminId = res.data[0].receiver_id;
          console.log("Admin Id: ",this.rest.adminId);
        }
        
          
      }

    },(err)=>{
      console.log("Api Error: ",err);
      
    })
  }

  startChatWithAdmin(){
    if(this.rest.adminId === undefined){
      
      console.log("Admin Id if undefined: ",this.rest.adminId);

      let arrayLength = this.adminsList.length
      console.log("arrayLength: ",arrayLength);
      let randomValue = Math.floor(Math.random() * arrayLength)
      console.log("randomValue: ",randomValue);
      this.selectedAdmin = this.adminsList[randomValue];
      console.log("Selected Admin: ",this.selectedAdmin);
      
      this.rest.adminId = this.selectedAdmin.users_system_id;
      console.log("Admin Id: ",this.rest.adminId);
      
      let data ={
        requestType:"startChat",
        users_customers_id:this.userid,
        other_users_customers_id:this.selectedAdmin.users_system_id
      }
      this.rest.presentLoader();
      this.rest.sendRequest("user_chat_live",data).subscribe((res:any)=>{
        this.rest.dismissLoader();
        console.log("Start Chat Ress: ",res);
        if(res.status == 'success'){
          this.rest.comingFrom = 'startChatWithAdmin'
          this.router.navigate(['/chat']);

        }

      },(err: any)=>{
        this.rest.dismissLoader();
        console.log("Api Error: ",err);
        
      });
    }else{
      console.log("admin id: ",this.rest.adminId);
      this.rest.comingFrom = 'startChatWithAdmin'
      this.router.navigate(['/chat']);
      
    }

   
  }


  goBack() {
    this.router.navigate(['/home']);
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

  async signOutForGoogle(){
    await GoogleAuth.signOut();
    // this.googleUserData = null;
  }

  async signOutForFacebook(){
    await FacebookLogin.logout();
  }
  
  async goLogout() { 
    if(this.accountType == "SignupWithSocial"){
      if(this.socialAccountType == "Google"){
        await this.signOutForGoogle();
      }else if(this.socialAccountType == "Facebook"){
        await this.signOutForFacebook();
      }else{
        
      }
    }
    // this.rest.profile_updated = false;
    this.onesignalid = localStorage.getItem("onesignaluserid");
    this.social_login_status = localStorage.getItem("social_login_status");

    localStorage.clear();
    localStorage.setItem("onesignaluserid", this.onesignalid);
    localStorage.setItem("social_login_status", this.social_login_status);
    this.navCtrl.navigateRoot('/login');
  
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
          if(this.imageupdate == 1){
            // this.rest.profile_updated = true;
          }
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

  gotoReservation(){
    this.rest.comfrom = 'profile'
    this.router.navigate(['myreservations'])
  }
}
