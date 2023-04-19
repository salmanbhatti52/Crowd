import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScannedTicketsPage } from './scanned-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: ScannedTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannedTicketsPageRoutingModule {}
