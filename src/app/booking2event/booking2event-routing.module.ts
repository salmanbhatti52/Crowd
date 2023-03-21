import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Booking2eventPage } from './booking2event.page';

const routes: Routes = [
  {
    path: '',
    component: Booking2eventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Booking2eventPageRoutingModule {}
