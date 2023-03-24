import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowticketPageRoutingModule } from './showticket-routing.module';

import { ShowticketPage } from './showticket.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowticketPageRoutingModule
  ],
  declarations: [ShowticketPage]
})
export class ShowticketPageModule {}
