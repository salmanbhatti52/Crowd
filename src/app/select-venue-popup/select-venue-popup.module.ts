import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectVenuePopupPageRoutingModule } from './select-venue-popup-routing.module';

import { SelectVenuePopupPage } from './select-venue-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectVenuePopupPageRoutingModule
  ],
  declarations: [SelectVenuePopupPage]
})
export class SelectVenuePopupPageModule {}
