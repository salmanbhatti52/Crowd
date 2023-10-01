import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";
import { formatDistance } from "date-fns";

// import * as moment from "moment";

@Component({
  selector: "app-noti",
  templateUrl: "./noti.page.html",
  styleUrls: ["./noti.page.scss"],
})
export class NotiPage implements OnInit {
  userdata: any = "";
  userid: any = "";
  notiArr: any = [];
  noticount = 0;
  constructor(public router: Router, public rest: RestService) {}

  ionViewWillEnter() {
    
  }

  ngOnInit() {
    this.noticount = 0;

    this.userdata = localStorage.getItem("userdata");

    this.userid = JSON.parse(this.userdata).users_customers_id;

    console.log("userid----", this.userid);

    var ss = JSON.stringify({
      users_customers_id: this.userid,
    });
    console.log("ss-----", ss);

    this.rest.presentLoader();

    this.rest.notifications(ss).subscribe((res: any) => {
      console.log("res noti-----", res);
      this.notiArr = []
      this.rest.dismissLoader();

      if (res.status == "error") {
        this.noticount = 1;
        this.rest.presentToast("No notifications found");
      } else {
        this.noticount = 2;
        for(let d of res.data){
          if(d?.admin_images){
            d.cover_images =  d.admin_images
          }
        }
        // this.notiArr = res.data;
        res.data = res.data.sort((a:any,b:any)=>a.notifications_id - b.notifications_id);
        for(let i= res.data.length - 1; i>=0; i--){
          this.notiArr.push(res.data[i]);
        }
         
        console.log("noti array",this.notiArr);
        
      }
    });
  }

  goToProfile() {
    this.router.navigate(["profile"]);
  }
  tab1Click() {
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.router.navigate(["noti"]);
  }

  calculatedate(opt: any) {
    // console.log("optttttttttt------",opt);
    // console.log("date-fns formatDistance------",formatDistance(new Date(),new Date(opt)));
    var dd = formatDistance(new Date(),new Date(opt))
    // var dd = moment(opt, "YYYYMMDD").fromNow(); // 11 years ago

    // console.log("dd--ffff------", dd);

    return dd;
  }

  handleRefresh(ev: any) {
    console.log("ev-----", ev);
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
    this.ionViewWillEnter();
  }

  goToDetail(val: any) {
    this.rest.detail = val;

    if(val.venues_id != null){
      console.log('venue id is not null');
      console.log(val);
      
      let data = {
        venues_id: val.venues_id
      };
      this.rest.presentLoader();
      this.rest.sendRequest('venues_by_id',data).subscribe((res:any)=>{
        this.rest.dismissLoader();
        if(res.status == 'success'){
          console.log("Venue Res: ", res);
          this.rest.detail = res.data[0];
          this.router.navigate(['/chat']);
        }
        
      });
      
    }else if(val.events_id != null){
      console.log('Event id is not null');
      console.log(val);

      let data = {
        users_customers_id: this.userid,
        events_id: val.events_id,
        longitude:"123",
        lattitude:"123",
        page_number:"1"
      };
      this.rest.presentLoader();
      this.rest.sendRequest('get_events_by_id',data).subscribe((res:any)=>{
        this.rest.dismissLoader();
        if(res.status == 'success'){
          console.log("Event Res: ", res);
          this.rest.detail = res.data[0];
          this.rest.comingFrom = 'event-detail';
          this.router.navigate(['/chat']);
        }
      });
      
    }else if(val.venues_id == null && val.events_id == null){
      console.log('both ids are null');
      console.log(val);
      this.rest.adminId = val.senders_id;
      this.rest.comingFrom = 'startChatWithAdmin';
      this.router.navigate(['/chat']);
      
    }else{
      console.log('no match');
      
    }
   
  }
}
