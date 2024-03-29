import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelReservationPageRoutingModule } from './cancel-reservation-routing.module';

import { CancelReservationPage } from './cancel-reservation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelReservationPageRoutingModule
  ],
  declarations: [CancelReservationPage]
})
export class CancelReservationPageModule {}
