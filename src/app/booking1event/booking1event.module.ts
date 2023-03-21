import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Booking1eventPageRoutingModule } from './booking1event-routing.module';

import { Booking1eventPage } from './booking1event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Booking1eventPageRoutingModule
  ],
  declarations: [Booking1eventPage]
})
export class Booking1eventPageModule {}
