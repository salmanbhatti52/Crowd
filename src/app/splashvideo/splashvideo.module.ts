import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashvideoPageRoutingModule } from './splashvideo-routing.module';

import { SplashvideoPage } from './splashvideo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashvideoPageRoutingModule
  ],
  declarations: [SplashvideoPage]
})
export class SplashvideoPageModule {}
