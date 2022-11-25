import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-newpass",
  templateUrl: "./newpass.page.html",
  styleUrls: ["./newpass.page.scss"],
})
export class NewpassPage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  goToLogin() {
    this.router.navigate(["login"]);
  }
}
