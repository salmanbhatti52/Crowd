import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-scan-tickets',
  templateUrl: './scan-tickets.page.html',
  styleUrls: ['./scan-tickets.page.scss'],
})
export class ScanTicketsPage implements OnDestroy {
  onesignalid: any = "";
  social_login_status: any = "";
  barcodeResult!: string;
  contenVisibility = '';
  constructor(public location:Location,
    public navCtrl:NavController,
    public rest:RestService
    ) { }

    ionViewWillEnter() {
      this.startScan();
    }
  

  ngOnDestroy(): void {
    this.stopScan();
  }

  async startScan() {
    try {
      // Check camera permission
      // This is just a simple example, check out the better checks below
      const permission = await this.checkPermission();
      if(!permission){
        return;
      }
      // make background of WebView transparent
      // note: if you are using ionic this might not be enough, check below
      this.contenVisibility = 'hidden';
      await BarcodeScanner.hideBackground();
      const bodyElement = document.querySelector('body');
      if (bodyElement !== null) {
        bodyElement.classList.add('scanner-active');
      }

      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
      console.log(result);
      BarcodeScanner.showBackground();
      // const bodyElement = document.querySelector('body');
      if (bodyElement !== null) {
        bodyElement.classList.remove('scanner-active');
      }
      this.contenVisibility = ''
      
      // if the result has content
      if (result.hasContent) {
        console.log("Result: ",result.content); // log the raw scanned content
        this.rest.barcodeResult = result.content;
        this.gotoTicketDetail();
      }  
    } catch (error) {
      console.log(error);
      this.stopScan();
    }
    
  }

  stopScan(){
    BarcodeScanner.hideBackground();
    BarcodeScanner.stopScan();
    this.contenVisibility = ''
  }

  async checkPermission(){
    try {
      const status = await BarcodeScanner.checkPermission({force: true});
      if(status.granted){
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      
      return false;
    }
  }

  goBack(){
    // this.location.back();
  }

  goLogout(){
    this.onesignalid = localStorage.getItem("onesignaluserid");
    this.social_login_status = localStorage.getItem("social_login_status");

    localStorage.clear();
    localStorage.setItem("onesignaluserid", this.onesignalid);
    localStorage.setItem("social_login_status", this.social_login_status);
    this.navCtrl.navigateRoot(["login"]);
  }

  gotoTicketDetail(){
    this.navCtrl.navigateForward('ticket-detail');
  }
}
