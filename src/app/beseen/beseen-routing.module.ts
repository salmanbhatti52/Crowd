import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeseenPage } from './beseen.page';

const routes: Routes = [
  {
    path: '',
    component: BeseenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeseenPageRoutingModule {}
