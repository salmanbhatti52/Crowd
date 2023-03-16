import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelbookPage } from './cancelbook.page';

const routes: Routes = [
  {
    path: '',
    component: CancelbookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelbookPageRoutingModule {}
