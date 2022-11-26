import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-changepass",
  templateUrl: "./changepass.page.html",
  styleUrls: ["./changepass.page.scss"],
})
export class ChangepassPage implements OnInit {
  constructor(public location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
