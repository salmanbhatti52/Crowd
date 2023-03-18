import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeepeopleeventPageRoutingModule } from './seepeopleevent-routing.module';

import { SeepeopleeventPage } from './seepeopleevent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeepeopleeventPageRoutingModule
  ],
  declarations: [SeepeopleeventPage]
})
export class SeepeopleeventPageModule {}
