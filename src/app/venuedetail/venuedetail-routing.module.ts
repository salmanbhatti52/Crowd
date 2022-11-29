import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VenuedetailPage } from './venuedetail.page';

const routes: Routes = [
  {
    path: '',
    component: VenuedetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VenuedetailPageRoutingModule {}
