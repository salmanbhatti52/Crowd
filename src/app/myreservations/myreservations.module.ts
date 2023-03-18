import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyreservationsPageRoutingModule } from './myreservations-routing.module';

import { MyreservationsPage } from './myreservations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyreservationsPageRoutingModule
  ],
  declarations: [MyreservationsPage]
})
export class MyreservationsPageModule {}
