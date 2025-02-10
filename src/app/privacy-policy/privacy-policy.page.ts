import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  privacyPolicy:any;
  constructor(public location:Location,public rest:RestService) { }

  ngOnInit() {
    this.getPrivacyPolicy();
  }

  goBack(){
    this.location.back();
  }

  getPrivacyPolicy(){
    this.rest.presentLoader();
    this.rest.getRequest("get_privacy_policy").subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Privacy Policy : ",res);
      this.privacyPolicy = res.data[0];
      console.log("Privacy Policy : ",this.privacyPolicy);
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
