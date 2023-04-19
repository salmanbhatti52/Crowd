import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizerEventsPage } from './organizer-events.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizerEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerEventsPageRoutingModule {}
