import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowTicketsPage } from './show-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: ShowTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowTicketsPageRoutingModule {}
