import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { GetstartPageRoutingModule } from "./getstart-routing.module";

import { GetstartPage } from "./getstart.page";
import { GoogleMapsModule } from "@angular/google-maps";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetstartPageRoutingModule,
    GoogleMapsModule,
  ],
  declarations: [GetstartPage],
})
export class GetstartPageModule {}
