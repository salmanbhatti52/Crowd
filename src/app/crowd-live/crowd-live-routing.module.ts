import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrowdLivePage } from './crowd-live.page';

const routes: Routes = [
  {
    path: '',
    component: CrowdLivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrowdLivePageRoutingModule {}
