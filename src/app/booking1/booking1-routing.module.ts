import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Booking1Page } from './booking1.page';

const routes: Routes = [
  {
    path: '',
    component: Booking1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Booking1PageRoutingModule {}
