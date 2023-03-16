import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cancelbook',
  templateUrl: './cancelbook.page.html',
  styleUrls: ['./cancelbook.page.scss'],
})
export class CancelbookPage implements OnInit {

  constructor(public modalCtrl: ModalController, 
    public router: Router) {}

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
