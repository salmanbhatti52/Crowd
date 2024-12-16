import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportEnquiriesPage } from './support-enquiries.page';

const routes: Routes = [
  {
    path: '',
    component: SupportEnquiriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportEnquiriesPageRoutingModule {}
