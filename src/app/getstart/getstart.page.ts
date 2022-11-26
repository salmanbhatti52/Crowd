import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-getstart",
  templateUrl: "./getstart.page.html",
  styleUrls: ["./getstart.page.scss"],
})
export class GetstartPage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  goToHome() {
    this.router.navigate(["home"]);
  }
}
