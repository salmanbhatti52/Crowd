import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Booking3eventPageRoutingModule } from './booking3event-routing.module';

import { Booking3eventPage } from './booking3event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Booking3eventPageRoutingModule
  ],
  declarations: [Booking3eventPage]
})
export class Booking3eventPageModule {}
