import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPageRoutingModule } from './ticket-routing.module';

import { TicketPage } from './ticket.page';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    TicketPageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [TicketPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TicketPageModule {}
