import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentmethodPageRoutingModule } from './paymentmethod-routing.module';
// import { GooglePayButtonModule } from '@google-pay/button-angular';
import { PaymentmethodPage } from './paymentmethod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentmethodPageRoutingModule,
    // GooglePayButtonModule
  ],
  declarations: [PaymentmethodPage]
})
export class PaymentmethodPageModule {}
