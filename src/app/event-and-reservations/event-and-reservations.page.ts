import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-event-and-reservations',
  templateUrl: './event-and-reservations.page.html',
  styleUrls: ['./event-and-reservations.page.scss'],
})
export class EventAndReservationsPage implements OnInit {

  constructor(public location:Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }


}
