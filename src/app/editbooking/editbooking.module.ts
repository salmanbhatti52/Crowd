import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditbookingPageRoutingModule } from './editbooking-routing.module';

import { EditbookingPage } from './editbooking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditbookingPageRoutingModule
  ],
  declarations: [EditbookingPage]
})
export class EditbookingPageModule {}
