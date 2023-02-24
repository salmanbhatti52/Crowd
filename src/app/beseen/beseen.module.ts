import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeseenPageRoutingModule } from './beseen-routing.module';

import { BeseenPage } from './beseen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeseenPageRoutingModule
  ],
  declarations: [BeseenPage]
})
export class BeseenPageModule {}
