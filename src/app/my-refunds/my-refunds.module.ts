import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRefundsPageRoutingModule } from './my-refunds-routing.module';

import { MyRefundsPage } from './my-refunds.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRefundsPageRoutingModule
  ],
  declarations: [MyRefundsPage]
})
export class MyRefundsPageModule {}
