import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelbookPageRoutingModule } from './cancelbook-routing.module';

import { CancelbookPage } from './cancelbook.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelbookPageRoutingModule
  ],
  declarations: [CancelbookPage]
})
export class CancelbookPageModule {}
