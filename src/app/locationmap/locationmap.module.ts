import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LocationmapPageRoutingModule } from "./locationmap-routing.module";

import { LocationmapPage } from "./locationmap.page";

import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

// Note we need a separate function as it's required by the module
export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationmapPageRoutingModule,
    GoogleMapsModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  declarations: [LocationmapPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LocationmapPageModule {}
