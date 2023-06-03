import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestNearbySearchPageRoutingModule } from './test-nearby-search-routing.module';

import { TestNearbySearchPage } from './test-nearby-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestNearbySearchPageRoutingModule
  ],
  declarations: [TestNearbySearchPage]
})
export class TestNearbySearchPageModule {}
