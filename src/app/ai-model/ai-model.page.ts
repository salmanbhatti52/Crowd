import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ai-model',
  templateUrl: './ai-model.page.html',
  styleUrls: ['./ai-model.page.scss'],
})
export class AiModelPage implements OnInit {

  constructor(public modalCtrl: ModalController, public router: Router) {}

  ngOnInit() {}

  closeModel() {
    this.modalCtrl.dismiss();
  }

  logout() {
    localStorage.clear();
    this.modalCtrl.dismiss();
    this.router.navigate(["login"]);
  }

}
