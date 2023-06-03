import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-organizer-events',
  templateUrl: './organizer-events.page.html',
  styleUrls: ['./organizer-events.page.scss'],
})
export class OrganizerEventsPage implements OnInit {
  userID: any = "";
  userdata: any = "";
  constructor(public location:Location,
    public rest:RestService,
    public router:Router) { }

  ionViewWillEnter(){
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;
  }  
  ngOnInit() {
    console.log("rest.venuesArray: ",this.rest.orgEventsArr);
  }

  goBack(){
    this.location.back();
  }

  likevenu(obj: any) {
    // this.HideFilter();
    console.log("likevenu", obj);

    if (obj.likes == 0) {
      obj.likes = 1;
      this.likeDislikeUServenu(obj.venues_id);
    }
  }

  likeDislikeUServenu(events_id: any) {
    console.log(events_id);
    var ss = JSON.stringify({
      users_customers_id: this.userID,
      venues_id: events_id,
    });

    console.log(ss);
    this.rest.venues_like_unlike(ss).subscribe((res: any) => {
      console.log(res);
    });
  }

  likeoutvenu(obj: any) {
    // this.HideFilter();
    console.log("likeoutvenu", obj);

    if (obj.likes == 1) {
      obj.likes = 0;
      this.likeDislikeUServenu(obj.venues_id);
    }
  }

  goToDetail(opt: any) {
    // this.getVenuesSuggested(opt);

    // this.HideFilter();
    console.log(opt);
    this.rest.detail = opt;
    // this.router.navigate(["venuedetail"]);
  }

  // getVenuesSuggested(opt: any) {
  //   let data = {
  //     // longitude:"71.4706624",
  //     // lattitude:"30.2170521",
  //     longitude: this.longitude,
  //     lattitude: this.latitude,
  //     venues_id: opt.venues_id,
  //     users_customers_id: this.userID,
  //   };
  //   this.rest.presentLoader();
  //   this.rest.sendRequest("venues_suggested", data).subscribe(
  //     (res: any) => {
  //       this.rest.dismissLoader();
  //       console.log("Response venues_suggested : ", res);
  //       if (res.status == "success") {
  //         this.venueList = res.data;
  //         this.showVenueModal();
  //       } else {
  //         this.venueList = [];
  //         // this.HideFilter();
  //         console.log(opt);
  //         this.rest.detail = opt;
  //         this.router.navigate(["venuedetail"]);
  //       }
  //     },
  //     (err) => {
  //       this.rest.dismissLoader();
  //       console.log("API Errror: ", err);
  //     }
  //   );
  // }
}
