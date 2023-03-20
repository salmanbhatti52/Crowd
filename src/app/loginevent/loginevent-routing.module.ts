import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogineventPage } from './loginevent.page';

const routes: Routes = [
  {
    path: '',
    component: LogineventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogineventPageRoutingModule {}
