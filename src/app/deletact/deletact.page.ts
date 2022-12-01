import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-deletact",
  templateUrl: "./deletact.page.html",
  styleUrls: ["./deletact.page.scss"],
})
export class DeletactPage implements OnInit {
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService
  ) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  godelete() {
    this.rest.presentToast(
      "Your requested is submitted. Your account will be removed soon."
    );
    this.location.back();
  }
}
