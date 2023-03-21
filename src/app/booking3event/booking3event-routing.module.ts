import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Booking3eventPage } from './booking3event.page';

const routes: Routes = [
  {
    path: '',
    component: Booking3eventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Booking3eventPageRoutingModule {}
