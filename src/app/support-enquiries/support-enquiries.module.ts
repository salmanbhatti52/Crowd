import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupportEnquiriesPageRoutingModule } from './support-enquiries-routing.module';

import { SupportEnquiriesPage } from './support-enquiries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupportEnquiriesPageRoutingModule
  ],
  declarations: [SupportEnquiriesPage]
})
export class SupportEnquiriesPageModule {}
