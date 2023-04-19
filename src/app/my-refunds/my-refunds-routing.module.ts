import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyRefundsPage } from './my-refunds.page';

const routes: Routes = [
  {
    path: '',
    component: MyRefundsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyRefundsPageRoutingModule {}
