import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { format } from 'date-fns';
interface Issue{
  issues:string;
}
@Component({
  selector: 'app-support-enquiries',
  templateUrl: './support-enquiries.page.html',
  styleUrls: ['./support-enquiries.page.scss'],
})
export class SupportEnquiriesPage implements OnInit {
  selectedIssue = 'Please select an Issue';
  showIssuesDd = false;
  feedback: string = "";
  supportEnquiries: any;
  issuesList: Issue[] = [];
  constructor(public location:Location,public rest:RestService) { }

  ngOnInit() {
    this.getSupportEnquiries();
    this.getIssuesList();
  }

  goBack(){
    this.location.back();
  }

  getSupportEnquiries(){
    this.rest.presentLoader();
    this.rest.getRequest("get_support_inquries").subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Support Enquries Terms : ",res);
      this.supportEnquiries = res.data[0];
      console.log("Support Enquries Terms : ",this.supportEnquiries);
    })
  }

  getIssuesList(){
    this.rest.getRequest("get_issue_list").subscribe((res:any)=>{
      console.log("issues list : ",res);
      this.issuesList = res.data;
      console.log("issues : ",this.issuesList);
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

  hideShowIssues() {
    if (this.showIssuesDd) {
      this.showIssuesDd = false;
    } else {
      this.showIssuesDd = true;
    }
  }

  issueClick(a: any) {
    this.showIssuesDd = false;
    console.log(a);
    this.selectedIssue = a.issues;
  }

}
