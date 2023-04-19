import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

  constructor(public location:Location,
    public router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }

  addcard() {
    this.router.navigate(["addcard"]);
  }
}
