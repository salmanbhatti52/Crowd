import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
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
  visibleReviews:any = [];
  ratingValue:any = 0.0;
  venueName: any;
  totalPages: number = 1;
  currentPage: number = 1;
  lastPage: number = 1;
  // reviewFound:any = false;
  constructor(public location: Location,public route: ActivatedRoute,public rest: RestService, public router:Router) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.route.queryParams.subscribe(params => {
      this.venueId = params['venueId'];
      this.userId = params['userId'];
      this.venueName = params['venueName'];
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
        this.totalPages =  Math.ceil(this.reviews.length/4);
        this.lastPage = this.totalPages;
        this.visibleReviews = this.reviews.slice(0,4);
      }
      
    });
  }

  goToPrevPage(){
    this.currentPage--;
    let start = (this.currentPage-1)*4;
    let end = this.currentPage*4;
    this.visibleReviews = this.reviews.slice(start,end);

  }

  goToNextPage(){
    this.currentPage++;
    let start = (this.currentPage-1)*4;
    let end = this.currentPage*4;
    this.visibleReviews = this.reviews.slice(start,end);
  }

  goBack() {
    this.location.back();
  }

  goForAddReview(){
    this.router.navigate(['/add-review'],{queryParams:{venueId:this.venueId,venueName:this.venueName}});
  }

}
