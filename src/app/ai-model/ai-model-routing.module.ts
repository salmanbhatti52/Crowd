import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AiModelPage } from './ai-model.page';

const routes: Routes = [
  {
    path: '',
    component: AiModelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AiModelPageRoutingModule {}
