import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowticketPage } from './showticket.page';

const routes: Routes = [
  {
    path: '',
    component: ShowticketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowticketPageRoutingModule {}
