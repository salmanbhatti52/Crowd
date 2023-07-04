import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  constructor(public location:Location,
    public modalCtrl:ModalController,
    public router:Router) { }

  ngOnInit() {
  }
  goBack(){
    this.location.back();
  }
  dismissModal(){
    this.modalCtrl.dismiss();
    this.router.navigate(['/home']);
  }

  // goToHome(){
    
  // }
}
