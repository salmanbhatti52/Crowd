import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectVenuePopupPage } from './select-venue-popup.page';

const routes: Routes = [
  {
    path: '',
    component: SelectVenuePopupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectVenuePopupPageRoutingModule {}
