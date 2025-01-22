import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-ai-model',
  templateUrl: './ai-model.page.html',
  styleUrls: ['./ai-model.page.scss'],
})
export class AiModelPage implements OnInit {
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

  activateAi(){
    let data = {
      users_customers_id:this.userId,
      ai_feature:"yes"
    }

    this.rest.sendRequest('update_ai_feature',data).subscribe((res:any)=>{
      console.log("Update Ai Feature: ",res);
      if(res.status == 'success'){
        this.rest.presentToast("Ai Feature Activated");
        localStorage.setItem('userdata',JSON.stringify(res.data));
        this.modalCtrl.dismiss(true,'activateAI');
      }
    });
  }

}
