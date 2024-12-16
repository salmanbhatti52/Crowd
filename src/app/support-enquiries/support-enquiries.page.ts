import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support-enquiries',
  templateUrl: './support-enquiries.page.html',
  styleUrls: ['./support-enquiries.page.scss'],
})
export class SupportEnquiriesPage implements OnInit {
  selectedIssue = 'Please select an Issue';
  showIssuesDd = false;
  feedback: string = "";
  issues = [
    {
      id: 1,
      name: "Can't Access My Account",
    },
    {
      id: 2,
      name: "Payment or Billing Issue",
    },
    {
      id: 3,
      name: "Error Messages in App",
    },
    {
      id: 4,
      name: "Features Not Working",
    },
    {
      id: 5,
      name: "Profile Update Issues",
    },
    {
      id: 6,
      name: "Other Technical Issue",
    },
  ];
  constructor(public location:Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
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
    this.selectedIssue = a.name;
  }

}
