import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VenuedetailPageRoutingModule } from './venuedetail-routing.module';

import { VenuedetailPage } from './venuedetail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VenuedetailPageRoutingModule
  ],
  declarations: [VenuedetailPage]
})
export class VenuedetailPageModule {}
