import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntellectualPropertiesPageRoutingModule } from './intellectual-properties-routing.module';

import { IntellectualPropertiesPage } from './intellectual-properties.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntellectualPropertiesPageRoutingModule
  ],
  declarations: [IntellectualPropertiesPage]
})
export class IntellectualPropertiesPageModule {}
