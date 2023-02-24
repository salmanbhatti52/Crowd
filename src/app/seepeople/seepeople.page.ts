import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: 'app-seepeople',
  templateUrl: './seepeople.page.html',
  styleUrls: ['./seepeople.page.scss'],
})
export class SeepeoplePage implements OnInit {

  userdata: any = "";
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
    this.userdata = localStorage.getItem("userdata");
    console.log("userdata----", this.userdata);

    var email = JSON.parse(this.userdata).email;
    console.log("email----", email);

    var ss = JSON.stringify({
      user_email: email,
      delete_reason: "test delete",
      comments: "Hello",
    });

    this.rest.presentLoader();
    this.rest.delete_account(ss).subscribe((res: any) => {
      this.rest.dismissLoader();
      console.log(res);

      if (res.status == "success") {
        this.rest.presentToast(res.message);
        this.location.back();
      } else {
        this.rest.presentToast(res.message);
      }
    });
  }
}
