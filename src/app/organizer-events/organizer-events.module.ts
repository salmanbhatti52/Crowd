import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizerEventsPageRoutingModule } from './organizer-events-routing.module';

import { OrganizerEventsPage } from './organizer-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrganizerEventsPageRoutingModule
  ],
  declarations: [OrganizerEventsPage]
})
export class OrganizerEventsPageModule {}
