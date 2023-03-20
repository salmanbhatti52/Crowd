import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogineventPageRoutingModule } from './loginevent-routing.module';

import { LogineventPage } from './loginevent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogineventPageRoutingModule
  ],
  declarations: [LogineventPage]
})
export class LogineventPageModule {}
