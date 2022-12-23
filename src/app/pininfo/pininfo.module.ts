import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PininfoPageRoutingModule } from './pininfo-routing.module';

import { PininfoPage } from './pininfo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PininfoPageRoutingModule
  ],
  declarations: [PininfoPage]
})
export class PininfoPageModule {}
