import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrowdAiPageRoutingModule } from './crowd-ai-routing.module';

import { CrowdAiPage } from './crowd-ai.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrowdAiPageRoutingModule
  ],
  declarations: [CrowdAiPage]
})
export class CrowdAiPageModule {}
