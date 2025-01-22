import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { RestService } from "../rest.service";

@Component({
  selector: "app-beseen",
  templateUrl: "./beseen.page.html",
  styleUrls: ["./beseen.page.scss"],
})
export class BeseenPage implements OnInit {
  userId = '';
  constructor(public modalCtrl: ModalController, public router: Router,
    public rest:RestService
  ) {}

  ngOnInit() {
    let userData =  JSON.parse(localStorage.getItem('userdata')!) ;
    console.log("userdata",userData);
    this.userId = userData.users_customers_id;
  }

  closeModel() {
    this.modalCtrl.dismiss();
  }

  logout() {
    localStorage.clear();
    this.modalCtrl.dismiss();
    this.router.navigate(["login"]);
  }

  activateBeSeen(){
    let data = {
      users_customers_id:this.userId,
      crowd_live:"yes"
    }

    this.rest.sendRequest('update_crowd_live',data).subscribe((res:any)=>{
      console.log("Update Crowd Live Feature: ",res);
      if(res.status == 'success'){
        this.rest.presentToast("Crowd Live Feature Activated");
        localStorage.setItem('userdata',JSON.stringify(res.data));
        this.modalCtrl.dismiss(true,'activateBeSeen');
      }
    });
  }
}
