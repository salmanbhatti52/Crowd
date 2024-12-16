import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventAndReservationsPage } from './event-and-reservations.page';

const routes: Routes = [
  {
    path: '',
    component: EventAndReservationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventAndReservationsPageRoutingModule {}
