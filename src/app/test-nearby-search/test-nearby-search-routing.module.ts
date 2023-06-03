import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestNearbySearchPage } from './test-nearby-search.page';

const routes: Routes = [
  {
    path: '',
    component: TestNearbySearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestNearbySearchPageRoutingModule {}
