import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrowdAiPage } from './crowd-ai.page';

const routes: Routes = [
  {
    path: '',
    component: CrowdAiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrowdAiPageRoutingModule {}
