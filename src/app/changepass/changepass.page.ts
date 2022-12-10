import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RestService } from "../rest.service";

@Component({
  selector: "app-changepass",
  templateUrl: "./changepass.page.html",
  styleUrls: ["./changepass.page.scss"],
})
export class ChangepassPage implements OnInit {
  userdata: any = "";
  constructor(public location: Location, public rest: RestService) {}

  oldpass: any = "";
  newpass: any = "";
  confirmpass: any = "";
  showPass1 = false;
  showPass2 = false;
  showPass3 = false;

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  submit() {
    console.log("oldpass", this.oldpass);
    console.log("newpass", this.newpass);
    console.log("confirmpass", this.confirmpass);
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);

    var email = JSON.parse(this.userdata).email;
    console.log("email----", email);

    if (this.oldpass == "") {
      this.rest.presentToast("Please enter Old Password");
    } else if (this.newpass == "") {
      this.rest.presentToast("Please enter New Password");
    } else if (this.confirmpass == "") {
      this.rest.presentToast("Please enter Confirm Password");
    } else if (this.newpass == this.confirmpass) {
      var ss = JSON.stringify({
        email: email,
        old_password: this.oldpass,
        password: this.newpass,
        confirm_password: this.confirmpass,
      });

      console.log("ss----", ss);

      this.rest.change_password(ss).subscribe((res: any) => {
        console.log(res);

        if (res.status == "success") {
          this.rest.presentToast(res.message);
        } else {
          this.rest.presentToast(res.message);
        }
      });
    } else {
      this.rest.presentToast("New password and confirm password not matched");
    }
  }

  togglePass1() {
    this.showPass1 = !this.showPass1;
  }

  togglePass2() {
    this.showPass2 = !this.showPass2;
  }

  togglePass3() {
    this.showPass3 = !this.showPass3;
  }
}
