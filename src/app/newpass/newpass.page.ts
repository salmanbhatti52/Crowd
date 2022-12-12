import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-newpass",
  templateUrl: "./newpass.page.html",
  styleUrls: ["./newpass.page.scss"],
})
export class NewpassPage implements OnInit {
  showPass1 = false;
  showPass2 = false;

  constructor(public router: Router) {}

  ngOnInit() {}

  goToLogin() {
    this.router.navigate(["login"]);
  }

  togglePass1() {
    this.showPass1 = !this.showPass1;
  }
  togglePass2() {
    this.showPass2 = !this.showPass2;
  }
}
