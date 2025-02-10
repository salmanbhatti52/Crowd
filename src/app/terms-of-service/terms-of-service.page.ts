import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.page.html',
  styleUrls: ['./terms-of-service.page.scss'],
})
export class TermsOfServicePage implements OnInit {

  constructor(public location:Location,public rest:RestService) { }
  termsOfService:any;
  ngOnInit() {
    this.getTermsOfServices();
  }

  goBack(){
    this.location.back();
  }

  getTermsOfServices(){
    this.rest.presentLoader();
    this.rest.getRequest("terms_services").subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("terms_services : ",res);
      this.termsOfService = res.data[0];
      console.log("terms_services : ",this.termsOfService);
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
