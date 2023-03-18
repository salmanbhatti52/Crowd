import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeepeopleeventPage } from './seepeopleevent.page';

const routes: Routes = [
  {
    path: '',
    component: SeepeopleeventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeepeopleeventPageRoutingModule {}
