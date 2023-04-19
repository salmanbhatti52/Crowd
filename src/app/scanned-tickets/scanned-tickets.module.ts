import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScannedTicketsPageRoutingModule } from './scanned-tickets-routing.module';

import { ScannedTicketsPage } from './scanned-tickets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScannedTicketsPageRoutingModule
  ],
  declarations: [ScannedTicketsPage]
})
export class ScannedTicketsPageModule {}
