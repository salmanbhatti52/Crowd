import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { IonTextarea } from '@ionic/angular';
import { RestService } from '../rest.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {
  @ViewChild(IonTextarea)
  textarea!: IonTextarea;

  rateStar1 = false;
  rateStar2 = false;
  rateStar3 = false;
  rateStar4 = false;
  rateStar5 = false;

  ratingValue: any;
  feedback: string = "";

  userdata: any;
  userid: any;
  venueId:any;

  constructor(public location: Location, public rest: RestService, public route:ActivatedRoute) {}

  ngOnInit() {
    this.rateStar(1.0);
    this.route.queryParams.subscribe(params=>{
      console.log(params);
      this.venueId = params['venueId'];
      console.log("venueId",this.venueId);
      
      
    })
  }

  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    this.userid = JSON.parse(this.userdata).users_customers_id;
  }

  addReview() {
    console.log(this.ratingValue);
    console.log(this.feedback);

    let data = {
      users_customers_id: this.userid,
      venues_id: this.venueId,
      review: this.feedback,
      review_rating: this.ratingValue,
    };
    console.log(data);
    this.rest.presentLoader();
    this.rest.sendRequest("add_reviews", data).subscribe((res: any) => {
      this.rest.dismissLoader();
      console.log(res);
      if(res.status=='success'){
        this.rest.presentToast("Thanks for your review!");
        this.goBack();
      }else if(res.status=='error'){
        this.rest.presentToast(res.message);
        this.goBack();

      }
    });
  }

  rateStar(val: any) {
    if (val == 1) {
      this.ratingValue = val;
      if (this.rateStar1 == false) {
        this.rateStar1 = true;
      } else {
        this.rateStar1 = false;
        this.rateStar2 = false;
        this.rateStar3 = false;
        this.rateStar4 = false;
        this.rateStar5 = false;
      }
    } else if (val == 2) {
      this.ratingValue = val;
      if (this.rateStar2 == false) {
        this.rateStar1 = true;
        this.rateStar2 = true;
      } else {
        this.rateStar2 = false;
        this.rateStar3 = false;
        this.rateStar4 = false;
        this.rateStar5 = false;
      }
    } else if (val == 3) {
      this.ratingValue = val;
      if (this.rateStar3 == false) {
        this.rateStar1 = true;
        this.rateStar2 = true;
        this.rateStar3 = true;
      } else {
        this.rateStar3 = false;
        this.rateStar4 = false;
        this.rateStar5 = false;
      }
    } else if (val == 4) {
      this.ratingValue = val;
      if (this.rateStar4 == false) {
        this.rateStar1 = true;
        this.rateStar2 = true;
        this.rateStar3 = true;
        this.rateStar4 = true;
      } else {
        this.rateStar4 = false;
        this.rateStar5 = false;
      }
    } else if (val == 5) {
      this.ratingValue = val;
      if (this.rateStar5 == false) {
        this.rateStar1 = true;
        this.rateStar2 = true;
        this.rateStar3 = true;
        this.rateStar4 = true;
        this.rateStar5 = true;
      } else {
        this.rateStar5 = false;
      }
    } else {
    }
  }
}
