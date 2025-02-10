import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-crowd-live',
  templateUrl: './crowd-live.page.html',
  styleUrls: ['./crowd-live.page.scss'],
})
export class CrowdLivePage implements OnInit {
  crowdLiveTerms:any;
  constructor(public location:Location, public rest:RestService) {
  }

  ngOnInit() {
    this.getCrowdLiveTerms();
  }

  goBack(){
    this.location.back();
  }

  getCrowdLiveTerms(){
    this.rest.presentLoader();
    this.rest.getRequest("get_crowd_live").subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Crowd Live Terms : ",res);
      this.crowdLiveTerms = res.data[0];
      console.log("Crowd Live Terms : ",this.crowdLiveTerms);
    })
  }

  getDateSlashFormat(val:any){
    if(val){
      return format(new Date(val), 'M/d/yyyy');
    }
    else{
      return val;
    }
  }
}
