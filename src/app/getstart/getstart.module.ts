import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetstartPageRoutingModule } from './getstart-routing.module';

import { GetstartPage } from './getstart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetstartPageRoutingModule
  ],
  declarations: [GetstartPage]
})
export class GetstartPageModule {}
