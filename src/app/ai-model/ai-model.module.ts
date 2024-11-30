import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AiModelPageRoutingModule } from './ai-model-routing.module';

import { AiModelPage } from './ai-model.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AiModelPageRoutingModule
  ],
  declarations: [AiModelPage]
})
export class AiModelPageModule {}
