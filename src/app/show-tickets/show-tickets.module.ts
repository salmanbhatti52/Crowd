import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowTicketsPageRoutingModule } from './show-tickets-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { ShowTicketsPage } from './show-tickets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowTicketsPageRoutingModule,
    QRCodeModule,

  ],
  declarations: [ShowTicketsPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ShowTicketsPageModule {}
