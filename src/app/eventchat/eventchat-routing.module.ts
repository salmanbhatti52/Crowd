import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventchatPage } from './eventchat.page';

const routes: Routes = [
  {
    path: '',
    component: EventchatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventchatPageRoutingModule {}
