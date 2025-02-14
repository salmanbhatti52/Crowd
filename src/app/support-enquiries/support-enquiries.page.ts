import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { format } from 'date-fns';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { el } from 'date-fns/locale';
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
  imgdata: any = "";
  imgdataComing: any = "";
  userData: any;
  userId: any;
  constructor(public location:Location,public rest:RestService) { }

  ngOnInit() {
    this.userData = localStorage.getItem("userdata");
    this.userId = JSON.parse(this.userData).users_customers_id;
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

  async addimg() {
    console.log("addd imge");

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });
    console.log(image);
    this.imgdata = image.base64String;
    this.imgdataComing = "data:image/jpeg;base64," + image.base64String;

    console.log("incoming img----", this.imgdata);
    // this.imageupdate = 1;
     
  }

  issueClick(a: any) {
    this.showIssuesDd = false;
    console.log(a);
    this.selectedIssue = a.issues;
  }

  report(){
    if(this.selectedIssue == "Please select an Issue"){
      this.rest.presentToast("Please select an Issue");
    }else if(this.feedback == ""){
      this.rest.presentToast("Please add some explanation");
    }else{
      let data = {
        users_customers_id:this.userId,
        report_title:this.selectedIssue,
        report_description:this.feedback,
        report_image:this.imgdata
      }
      this.rest.sendRequest('report_inquiry',data).subscribe((res:any)=>{
        console.log('report_inquiry',res);
        if(res.status == 'success'){
          this.rest.presentToast("Reported Successfully");
          this.feedback = "";
          this.selectedIssue = "Please select an Issue";
          this.imgdata = "";
          this.imgdataComing = ""; 
          this.goBack();
        }
      })
    }
  }

}
