import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanTicketsPage } from './scan-tickets.page';

const routes: Routes = [
  {
    path: '',
    component: ScanTicketsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanTicketsPageRoutingModule {}
