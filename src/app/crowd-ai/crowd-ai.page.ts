import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-crowd-ai',
  templateUrl: './crowd-ai.page.html',
  styleUrls: ['./crowd-ai.page.scss'],
})
export class CrowdAiPage implements OnInit {
  aiTerms:any;
  constructor(public location:Location,public rest:RestService) { }

  ngOnInit() {
    this.getAITerms();
  }

  goBack(){
    this.location.back();
  }

  getAITerms(){
    this.rest.presentLoader();
    this.rest.getRequest("get_crowd_ai").subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("AI Terms : ",res);
      this.aiTerms = res.data[0];
      console.log("AI Terms : ",this.aiTerms);
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
