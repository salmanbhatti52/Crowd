import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestRefundPageRoutingModule } from './request-refund-routing.module';

import { RequestRefundPage } from './request-refund.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestRefundPageRoutingModule
  ],
  declarations: [RequestRefundPage]
})
export class RequestRefundPageModule {}
