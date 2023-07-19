import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventchatPageRoutingModule } from './eventchat-routing.module';

import { EventchatPage } from './eventchat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventchatPageRoutingModule
  ],
  declarations: [EventchatPage]
})
export class EventchatPageModule {}
