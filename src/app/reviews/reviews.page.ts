import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../rest.service';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  venueId:any;
  userId:any;
  reviews:any = [];
  // reviewFound:any = false;
  constructor(public location: Location,public route: ActivatedRoute,public rest: RestService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.venueId = params['venueId'];
      this.userId = params['userId'];
      console.log(this.venueId);
      console.log(this.userId);
    });

    this.getVenueReviews(); 
  }

  getVenueReviews(){
    let data = {
      users_customers_id:this.userId,  
      venues_id:this.venueId
    }
    this.rest.presentLoader();
    this.rest.sendRequest('get_reviews',data ).subscribe((res: any)=>{
      console.log(res);
      this.rest.dismissLoader();
      if(res.status == 'success'){
        this.reviews = res.data;
      }
      
    });
  }

  goBack() {
    this.location.back();
  }

}
