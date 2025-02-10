import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RestService } from '../rest.service';
import { format } from 'date-fns';
@Component({
  selector: 'app-intellectual-properties',
  templateUrl: './intellectual-properties.page.html',
  styleUrls: ['./intellectual-properties.page.scss'],
})
export class IntellectualPropertiesPage implements OnInit {
  intellectualPropertiesTerms:any;
  constructor(public location:Location,public rest:RestService) {

   }

  ngOnInit() {
    this.getIntellectualProperties();
  }

  goBack(){
    this.location.back();
  }

  getIntellectualProperties(){
    this.rest.presentLoader();
    this.rest.getRequest("get_intellectual_properties").subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Intellectual Properties Terms : ",res);
      this.intellectualPropertiesTerms = res.data[0];
      console.log("Intellectual Properties Terms : ",this.intellectualPropertiesTerms);
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
