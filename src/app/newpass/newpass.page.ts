import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-newpass",
  templateUrl: "./newpass.page.html",
  styleUrls: ["./newpass.page.scss"],
})
export class NewpassPage implements OnInit {
  showPass1 = false;
  showPass2 = false;

  pass1: any = "";
  pass2: any = "";

  constructor(public router: Router, public rest: RestService) {}

  ngOnInit() {}

  goToLogin() {
    if (this.pass1 == "") {
      this.rest.presentToast("Plese enter Password.");
    } else if (this.pass2 == "") {
      this.rest.presentToast("Plese enter Confirm Password.");
    } else if (this.pass1 != this.pass2) {
      this.rest.presentToast("Password and Confirm Password not matched.");
    } else {
      this.rest.presentLoader();
      var ss = JSON.stringify({
        email: localStorage.getItem("otpemail"),
        otp: localStorage.getItem("otp"),
        password: this.pass1,
        confirm_password: this.pass1,
      });

      this.rest.modify_password(ss).subscribe((res: any) => {
        this.rest.dismissLoader();
        console.log(res);

        if (res.status == "success") {
          this.rest.presentToast("Password updated successfully.");
          this.router.navigate(["login"]);
        } else {
          this.rest.presentToast(res.message);
        }
      });
    }
  }

  togglePass1() {
    this.showPass1 = !this.showPass1;
  }
  togglePass2() {
    this.showPass2 = !this.showPass2;
  }
}
