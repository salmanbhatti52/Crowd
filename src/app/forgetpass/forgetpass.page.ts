import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-forgetpass",
  templateUrl: "./forgetpass.page.html",
  styleUrls: ["./forgetpass.page.scss"],
})
export class ForgetpassPage implements OnInit {
  constructor(public router: Router, public rest: RestService, public location:Location) {}

  email: any = "";

  ngOnInit() {}

  goBack(){
    this.location.back();
  }

  newPass() {
    if (this.email == "") {
      this.rest.presentToast("Plese enter valid email address.");
    } else {
      this.rest.presentLoader();
      var ss = JSON.stringify({
        email: this.email,
      });

      this.rest.forgot_password(ss).subscribe((res: any) => {
        this.rest.dismissLoader();
        console.log(res);

        if (res.status == "success") {
          this.rest.presentToast(res.data.message);
          localStorage.setItem("otp", res.data.otp);
          localStorage.setItem("otpemail", this.email);

          this.router.navigate(["otp"]);
        } else {
          this.rest.presentToast(res.message);
        }
      });
    }
  }
}
