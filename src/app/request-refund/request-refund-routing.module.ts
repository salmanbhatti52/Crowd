import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestRefundPage } from './request-refund.page';

const routes: Routes = [
  {
    path: '',
    component: RequestRefundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRefundPageRoutingModule {}
