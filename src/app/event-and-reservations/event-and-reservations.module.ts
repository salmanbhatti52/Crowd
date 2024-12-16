import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventAndReservationsPageRoutingModule } from './event-and-reservations-routing.module';

import { EventAndReservationsPage } from './event-and-reservations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventAndReservationsPageRoutingModule
  ],
  declarations: [EventAndReservationsPage]
})
export class EventAndReservationsPageModule {}
