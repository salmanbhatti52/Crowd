import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

@Component({
  selector: "app-deletact",
  templateUrl: "./deletact.page.html",
  styleUrls: ["./deletact.page.scss"],
})
export class DeletactPage implements OnInit {
  userdata: any = "";
  deleteRequestType = 'permanently'
  deleteOldBooking = false;
  feedback = '';
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public changeDetectorRef:ChangeDetectorRef
  ) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  closeModel(){
    this.deleteOldBooking = false;
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
      this.deleteOldBooking = false;
      this.changeDetectorRef.detectChanges();
      this.router.navigate(['/profile']);
    });
  }

  showConfirmationModal(){
    this.deleteOldBooking = true;
  }

  selectDeleteRequestType(requestType:string){
    this.deleteRequestType = requestType;
  }
}
