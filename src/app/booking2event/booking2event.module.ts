import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Booking2eventPageRoutingModule } from './booking2event-routing.module';

import { Booking2eventPage } from './booking2event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Booking2eventPageRoutingModule
  ],
  declarations: [Booking2eventPage]
})
export class Booking2eventPageModule {}
