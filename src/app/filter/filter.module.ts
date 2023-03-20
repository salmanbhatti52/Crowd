import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FilterPageRoutingModule } from "./filter-routing.module";

import { FilterPage } from "./filter.page";
import { CalendarModule } from "ion2-calendar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilterPageRoutingModule,
    CalendarModule.forRoot({
      doneLabel: "Save",
      closeIcon: true,
    }),
  ],
  declarations: [FilterPage],
})
export class FilterPageModule {}
