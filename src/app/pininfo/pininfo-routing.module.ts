import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PininfoPage } from './pininfo.page';

const routes: Routes = [
  {
    path: '',
    component: PininfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PininfoPageRoutingModule {}
