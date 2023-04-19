import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanTicketsPageRoutingModule } from './scan-tickets-routing.module';

import { ScanTicketsPage } from './scan-tickets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanTicketsPageRoutingModule
  ],
  declarations: [ScanTicketsPage]
})
export class ScanTicketsPageModule {}
