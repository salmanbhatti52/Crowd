import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { Booking1PageRoutingModule } from "./booking1-routing.module";

import { Booking1Page } from "./booking1.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, Booking1PageRoutingModule],
  declarations: [Booking1Page],
})
export class Booking1PageModule {}
