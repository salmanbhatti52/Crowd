import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntellectualPropertiesPage } from './intellectual-properties.page';

const routes: Routes = [
  {
    path: '',
    component: IntellectualPropertiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntellectualPropertiesPageRoutingModule {}
