import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeePathPageRoutingModule } from './see-path-routing.module';

import { SeePathPage } from './see-path.page';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsModule,
    SeePathPageRoutingModule
  ],
  declarations: [SeePathPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeePathPageModule {}
