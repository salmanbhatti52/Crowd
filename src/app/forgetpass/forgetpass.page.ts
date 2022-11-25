import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-forgetpass",
  templateUrl: "./forgetpass.page.html",
  styleUrls: ["./forgetpass.page.scss"],
})
export class ForgetpassPage implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  newPass() {
    this.router.navigate(["otp"]);
  }
}
