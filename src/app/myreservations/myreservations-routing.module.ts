import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyreservationsPage } from './myreservations.page';

const routes: Routes = [
  {
    path: '',
    component: MyreservationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyreservationsPageRoutingModule {}
