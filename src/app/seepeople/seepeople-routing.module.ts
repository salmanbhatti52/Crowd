import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeepeoplePage } from './seepeople.page';

const routes: Routes = [
  {
    path: '',
    component: SeepeoplePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeepeoplePageRoutingModule {}
