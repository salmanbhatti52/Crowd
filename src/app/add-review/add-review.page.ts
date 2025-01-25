import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { IonTextarea } from '@ionic/angular';
import { RestService } from '../rest.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
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

  ratingValue: any = 0;
  feedback: string = "";

  userdata: any;
  userid: any;
  venueId:any;
  venueName: any;

  tableTypes: any = [];
  selectedTableName: any;

  constructor(public location: Location, public rest: RestService, public route:ActivatedRoute) {}

  ngOnInit() {
    // this.rateStar(1.0);
    this.route.queryParams.subscribe(params=>{
      console.log(params);
      this.venueId = params['venueId'];
      this.venueName = params['venueName'];
      console.log("venueId",this.venueId);
      
      
    })
  }

  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.userdata = localStorage.getItem("userdata");
    this.userid = JSON.parse(this.userdata).users_customers_id;
    this.getTableTypes();
  }

  getTableTypes() {
   
    this.rest.presentLoader();
    this.rest.getRequest("get_table_types").subscribe((res: any) => {
      this.rest.dismissLoader();
      this.tableTypes = res.data;
      console.log(res);
    });
  }

  selectTableType(event:any,type:any){
    this.selectedTableName = type.table_type_name;
    if (event.detail.checked) {
      this.selectedTableName = type.table_type_name;
    }else{
      this.selectedTableName = "";
    }

    console.log(event);
    console.log(type);
    console.log(this.selectedTableName);
  }

  addReview() {
    console.log(this.ratingValue);
    console.log(this.feedback);

    let data = {
      users_customers_id: this.userid,
      venues_id: this.venueId,
      review: this.feedback,
      table_type: this.selectedTableName,
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
      }
    },(err)=>{
      this.rest.dismissLoader();
       err = err.error;
      if(err.status=='error'){
        this.rest.presentToast(err.message);
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
