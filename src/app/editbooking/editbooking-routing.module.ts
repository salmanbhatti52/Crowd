import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditbookingPage } from './editbooking.page';

const routes: Routes = [
  {
    path: '',
    component: EditbookingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditbookingPageRoutingModule {}
