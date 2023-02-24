import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeepeoplePageRoutingModule } from './seepeople-routing.module';

import { SeepeoplePage } from './seepeople.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeepeoplePageRoutingModule
  ],
  declarations: [SeepeoplePage]
})
export class SeepeoplePageModule {}
