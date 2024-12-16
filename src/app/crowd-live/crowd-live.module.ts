import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrowdLivePageRoutingModule } from './crowd-live-routing.module';

import { CrowdLivePage } from './crowd-live.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrowdLivePageRoutingModule
  ],
  declarations: [CrowdLivePage]
})
export class CrowdLivePageModule {}
