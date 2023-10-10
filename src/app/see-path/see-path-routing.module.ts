import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeePathPage } from './see-path.page';

const routes: Routes = [
  {
    path: '',
    component: SeePathPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeePathPageRoutingModule {}
