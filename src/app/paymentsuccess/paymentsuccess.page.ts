import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { RestService } from "../rest.service";
import { format, parse } from "date-fns";

@Component({
  selector: "app-paymentsuccess",
  templateUrl: "./paymentsuccess.page.html",
  styleUrls: ["./paymentsuccess.page.scss"],
})
export class PaymentsuccessPage implements OnInit {
  userdata: any = "";
  selectedEvent: any = "";
  selectedBooking: any = "";

  mdate: any = "";
  mtime: any = "";
  userID: any = "";
  showBookingModel: boolean = false;
  constructor(public rest:RestService, public modalCtrl: ModalController, public router: Router,
    public changeDetectorRef:ChangeDetectorRef, public navCtrl:NavController
  ) {}

  ionViewWillEnter(){
    this.showBookingModel = true;
    this.selectedEvent = this.rest.detail;
  }

  ngOnInit() {

  }

  // closeModel() {
  //   this.modalCtrl.dismiss();
  // }

  viewBooking(){
    // this.rest.comfrom = 'booking2';
    this.showBookingModel = false;
    this.changeDetectorRef.detectChanges();
    this.rest.comfrom = 'paymentmethod'
    this.navCtrl.navigateRoot(['/ticket']);
  }

  closeModal(){
    this.showBookingModel = false;
    this.changeDetectorRef.detectChanges();
    this.navCtrl.navigateRoot(['/home']);

  }

  getTime(val:any){
    if(val){
       val = parse(val, 'HH:mm:ss', new Date());
       return val = format(val, 'h:mma');
    }
    else{
      return val;
    }
  }
  

  getDate(val:any){
    if(val){
      return format(new Date(val), 'E, dd MMM');
    }
    else{
      return val;
    }
  }
}
