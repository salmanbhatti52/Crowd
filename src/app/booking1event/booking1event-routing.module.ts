import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Booking1eventPage } from './booking1event.page';

const routes: Routes = [
  {
    path: '',
    component: Booking1eventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Booking1eventPageRoutingModule {}
