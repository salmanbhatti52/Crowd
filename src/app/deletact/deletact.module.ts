import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeletactPageRoutingModule } from './deletact-routing.module';

import { DeletactPage } from './deletact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeletactPageRoutingModule
  ],
  declarations: [DeletactPage]
})
export class DeletactPageModule {}
