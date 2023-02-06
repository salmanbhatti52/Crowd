import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-venue-popup',
  templateUrl: './select-venue-popup.page.html',
  styleUrls: ['./select-venue-popup.page.scss'],
})
export class SelectVenuePopupPage implements OnInit {

  constructor(public modalCtrlr:ModalController) { }

  ngOnInit() {
  }
  dismiss(){
    this.modalCtrlr.dismiss();
  }
}
