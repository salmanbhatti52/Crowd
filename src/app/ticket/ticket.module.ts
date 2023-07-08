import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPageRoutingModule } from './ticket-routing.module';

import { TicketPage } from './ticket.page';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { QRCodeModule } from 'angularx-qrcode';
// import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator';
// type PDFGenerator = typeof PDFGenerator;
// import { PDFGenerator, PDFGeneratorOriginal } from '@awesome-cordova-plugins/pdf-generator';
// type PDFGenerator = typeof PDFGeneratorOriginal;
// import 'cordova-plugin-pdfgenerator';
// declare var pdfgenerator: type PDFGenerator;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QRCodeModule,
    TicketPageRoutingModule,
    GoogleMapsModule,
    // PDFGeneratorOriginal
  ],
  exports:[
  ],
  declarations: [TicketPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TicketPageModule {}
