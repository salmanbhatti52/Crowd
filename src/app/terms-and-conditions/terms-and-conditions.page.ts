import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage implements OnInit {

  constructor(public location:Location,public router:Router) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }

  goToTermsOfService(){
    this.router.navigate(['/terms-of-service']);
  }

  goToPrivacyPolicy(){
    this.router.navigate(['/privacy-policy']);

  }

  goToCrowdAI(){
    this.router.navigate(['/crowd-ai']);

  }

  goToCrowdLive(){
    this.router.navigate(['/crowd-live']);

  }

  goToEventAndReservations(){
    this.router.navigate(['/event-and-reservations']);

  }

  goToIntellectualProperties(){
    this.router.navigate(['/intellectual-properties']);

  }
}
