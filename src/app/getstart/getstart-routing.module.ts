import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetstartPage } from './getstart.page';

const routes: Routes = [
  {
    path: '',
    component: GetstartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetstartPageRoutingModule {}
