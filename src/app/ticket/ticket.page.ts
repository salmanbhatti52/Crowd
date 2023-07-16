import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';
// import {
//   GoogleMap,
//   MapInfoWindow,
//   MapGeocoder,
//   MapGeocoderResponse,
//   MapMarker,
// } from "@angular/google-maps";
// import  { Screenshot } from 'capacitor-screenshot';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { Platform } from '@ionic/angular';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HttpClient } from '@angular/common/http';
declare var pdfMake: any; // Declare the pdfMake variable
import html2canvas from 'html2canvas';

// import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator';
// type PDFGenerator = typeof PDFGenerator;
// import 'cordova-plugin-pdfgenerator';
// declare var pdfgenerator: any;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {
  noOfTickets=0;
  ticketId = 'ticket';
  data1 = ''
  data2 = ''
  takingScreenshot=false;
  pdfObj:any;
  photoPreview:any;
  myAngularxQrCode: string = ''
  userdata: any;
  userName: any;
  userId:any;
  @ViewChild("myGoogleMap", { static: false })
  // map!: GoogleMap;
  zoom = 13;
  maxZoom = 15;
  tickets:any;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: "roadmap",
    disableDefaultUI: true,
    // styles: [
    //   { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    //   { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    //   { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    //   {
    //     featureType: "administrative.locality",
    //     elementType: "labels.text.fill",
    //     stylers: [{ color: "#d59563" }],
    //   },

    //   {
    //     featureType: "poi.park",
    //     elementType: "geometry",
    //     stylers: [{ color: "#263c3f" }],
    //   },
    //   {
    //     featureType: "poi.park",
    //     elementType: "labels.text.fill",
    //     stylers: [{ color: "#6b9a76" }],
    //   },
    //   {
    //     featureType: "road",
    //     elementType: "geometry",
    //     stylers: [{ color: "#38414e" }],
    //   },
    //   {
    //     featureType: "road",
    //     elementType: "geometry.stroke",
    //     stylers: [{ color: "#212a37" }],
    //   },
    //   {
    //     featureType: "road",
    //     elementType: "labels.text.fill",
    //     stylers: [{ color: "#9ca5b3" }],
    //   },
    //   {
    //     featureType: "road.highway",
    //     elementType: "geometry",
    //     stylers: [{ color: "#746855" }],
    //   },
    //   {
    //     featureType: "road.highway",
    //     elementType: "geometry.stroke",
    //     stylers: [{ color: "#1f2835" }],
    //   },
    //   {
    //     featureType: "road.highway",
    //     elementType: "labels.text.fill",
    //     stylers: [{ color: "#f3d19c" }],
    //   },
    //   {
    //     featureType: "transit",
    //     elementType: "geometry",
    //     stylers: [{ color: "#2f3948" }],
    //   },
    //   {
    //     featureType: "transit.station",
    //     elementType: "labels.text.fill",
    //     stylers: [{ color: "#d59563" }],
    //   },
    //   {
    //     featureType: "water",
    //     elementType: "geometry",
    //     stylers: [{ color: "#17263c" }],
    //   },
    //   {
    //     featureType: "water",
    //     elementType: "labels.text.fill",
    //     stylers: [{ color: "#515c6d" }],
    //   },
    //   {
    //     featureType: "water",
    //     elementType: "labels.text.stroke",
    //     stylers: [{ color: "#17263c" }],
    //   },
    //   {
    //     featureType: "poi",
    //     elementType: "labels",
    //     stylers: [{ visibility: "off" }],
    //   },
    // ],
  };
  ss:any;
  content!: string;
  logoData:any;
  activeIndex: any;
  currentTicketToken: any;
  refundRequestCount: any;
  pdfData: any;
  constructor(public location:Location,
    public modalCtrl:ModalController,
    public router:Router,
    public rest:RestService,
    private plt:Platform,
    private fileOpener:FileOpener,
    public http:HttpClient,
    public navCtrl:NavController
    ) { }

  async ngOnInit() {
    // if(this.rest.billDetails?.lattitude){
      // let lat = parseFloat(this.rest.billDetails.lattitude)
      // let lng = parseFloat(this.rest.billDetails.longitude)
      // this.center = {
      //   lat: lat,
      //   lng: lng,
      // };
      this.noOfTickets = this.rest.billDetails.ticket_requested;
      console.log("Number Of Tickets: ",this.noOfTickets);
      console.log("ticketTokens: ",this.rest.ticketToken);
      const input = this.rest.ticketToken;
      const regex = /"([^"]*)"/g;
      const matches = [];
      
      let match;
      while ((match = regex.exec(input))) {
        matches.push(match[1]);
      }
      
      console.log(matches);
      this.tickets = matches
      console.log("this.tickets: ",this.tickets);
      
      console.log("calling localAssetBase64");
      this.loadLocalAssetToBase64();

      setTimeout(() => {
        this.getTicketImages();
      }, 2000);
      if(this.rest.comfrom == 'paymentmethod'){

        this.sendTicketsAtBackend();
      }
    // }
  }

  ionViewWillEnter() {
    if(this.rest.billDetails?.event_name){
      // event_name, venue_name, event_date, event_start_time, event_end_time,package_type, package_name, package_price, price_per_ticket, ticket_requested, crowd_fee, total_bill, location, bookingStatus, transactionStatus
      this.myAngularxQrCode = `${this.rest.billDetails.event_name}_${this.rest.billDetails.venue_name}_${this.rest.billDetails.event_date}_${this.rest.billDetails.event_start_time}_${this.rest.billDetails.event_end_time}_${this.rest.billDetails.package_type}_${this.rest.billDetails.package_name}_$${this.rest.billDetails.package_price}_$${this.rest.billDetails.price_per_ticket}_${this.rest.billDetails.ticket_requested}_$5_$${this.rest.billDetails.total_bill}_${this.rest.billDetails.location}_${this.rest.bookingStatus}_${this.rest.transactionStatus}`;
    }

    console.log("qrCodeDAta: ", this.myAngularxQrCode);
    
    this.userdata = localStorage.getItem('userdata');
    this.userName = JSON.parse(this.userdata).username;
    this.userId = JSON.parse(this.userdata).users_customers_id;

  }

  loadLocalAssetToBase64(){
    this.http.get('./assets/imgs/icons/crowd_app_icon.jpg',{responseType:'blob'})
    .subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.logoData = reader.result;
      }
      reader.readAsDataURL(res);
    });
  }

  onSlideChange(ev:any){
    // console.log("Swiper EVVV",ev);
    // console.log("active Index is ",ev.detail[0].activeIndex);
    // this.activeIndex = ev.detail[0].activeIndex;
    // for(let i=0; i<this.tickets.length; i++){
    //   if(this.activeIndex == i ){
    //     this.currentTicketToken = this.tickets[i];
    //   }
    // }
  }

  generatePDF(){
    this.rest.presentLoader('Creating PDF Please wait..');
    
    setTimeout(() => {
      console.log("generatepddfCalled");
      let content: any[] = [];
      let lastIndex = this.tickets.length -1; 
      for(let i=0; i<this.tickets.length; i++){
        if(i != lastIndex ){
          content.push({
            text: new Date().toString(),
            alignment: 'right',
            style: 'subheader'
          },{
            image: this.data1,
            width: 500
          },{ 
            text: this.tickets[i],
            alignment: 'center',
            style: 'header',
          },
  
          {
            image: this.data2,
            width: 500,
            pageBreak: 'after'
          },)
        }else{
          content.push({
            text: new Date().toString(),
            alignment: 'right',
            style: 'subheader'
          },{
            image: this.data1,
            width: 500
          },{ 
            text: this.tickets[i],
            alignment: 'center',
            style: 'header',
          },
  
          {
            image: this.data2,
            width: 500,
          },)
        }
      }
      
      const docDefinition = {
        content: content,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [10, 10, 10, 10]
          },
          subheader: {
            fontSize: 15,
            bold: true,
            margin: [0, 0, 0, 20],
          },
          
        }
      };
      this.pdfObj = pdfMake.createPdf(docDefinition);
      console.log(this.pdfObj);
      this.downloadPdf();
    }, 4000);
  }

  downloadPdf(){

    if(this.plt.is('capacitor')){
      console.log("capacitor is the platformmmmmmmmm");
      this.pdfObj.getBase64(async (data:any) =>{
        try {
          console.log("data from this.pdfObj.getBase64", data );
          let path = `pdf/Event_Ticket_${Date.now()}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory:Directory.Library,
            recursive:true,
            // encoding:Encoding.UTF8
          });
          this.fileOpener.open(`${result.uri}`, 'application/pdf');
          this.rest.dismissLoader();
          this.navCtrl.navigateRoot(['/home']);
          
        } catch (error) {
          this.rest.dismissLoader();
          console.log('Unable to write file', error);
        }
      })
      

    }else{

      this.pdfObj.download('ticket.pdf');
      this.rest.dismissLoader();
      this.navCtrl.navigateRoot(['/home'])
    }

  }

  getTicketImages(){
    const element: HTMLElement | null = document.getElementById('ticket-p-a');
    if(element !== null){
      html2canvas(element).then((canvas:HTMLCanvasElement)=>{
        this.data1 = canvas.toDataURL();
        console.log("data1: ",this.data1);

      });
    }

    setTimeout(() => {
      const element1: HTMLElement | null = document.getElementById('ticket-p-b');
      if(element1 !== null){
        html2canvas(element1).then((canvas:HTMLCanvasElement)=>{
          this.data2 = canvas.toDataURL();
          console.log("data2: ",this.data2);

        });
      }
    }, 2000);
  }

  sendTicketsAtBackend(){
    console.log("generatepddfForBackend");
    let tickets = this.tickets
    let pdfObj:any;
    
    setTimeout(() => {
      let content: any[] = [];
      let lastIndex = tickets.length -1; 
      for(let i=0; i<tickets.length; i++){
        if(i != lastIndex ){
          content.push({
            text: new Date().toString(),
            alignment: 'right',
            style: 'subheader'
          },{
            image: this.data1,
            width: 500
          },{ 
            text: tickets[i],
            alignment: 'center',
            style: 'header',
          },
  
          {
            image: this.data2,
            width: 500,
            pageBreak: 'after'
          },)
        }else{
          content.push({
            text: new Date().toString(),
            alignment: 'right',
            style: 'subheader'
          },{
            image: this.data1,
            width: 500
          },{ 
            text: tickets[i],
            alignment: 'center',
            style: 'header',
          },
  
          {
            image: this.data2,
            width: 500,
          },)
        }
        
      }
      
      const docDefinition = {
        content: content,
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [10, 10, 10, 10]
          },
          subheader: {
            fontSize: 15,
            bold: true,
            margin: [0, 0, 0, 20],
          },
        }
      };
      pdfObj = pdfMake.createPdf(docDefinition);
      console.log("pdfObj for backend: ",pdfObj);

      if(this.plt.is('capacitor')){
        
        console.log("capacitor is the platformmmmmmmmm");
        pdfObj.getBase64(async (data:any) =>{
         
          let payload = {
            event_booking_id: this.rest.eventBookingId,
            ticket_file: data
          }
          console.log(payload);
          
          this.rest.sendRequest("show_ticket",payload).subscribe((res:any)=>{
            console.log("SendPdfAPI RES: ",res);
          })
    
        })
      }
    }, 7000);
    
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    console.log(isOpen);
    // isOpen = !isOpen
    
    console.log("setopencalled");
    
    this.isModalOpen = isOpen;
  }

  goBack(){
  if(this.rest.comfrom == 'paymentmethod'){
      this.router.navigate(['/home']);
      this.rest.comfrom = '';
    }else{
      this.location.back();
    }
  }

  dismissModal(isOpen: boolean){
    this.isModalOpen = isOpen;
    // this.modalCtrl.dismiss();
    setTimeout(() => {
      
      // this.navCtrl.navigateRoot(['/home']);
    }, 500);
  }

  reguestRefund(isOpen: boolean){
    
    if(this.refundRequestCount != 1){
      this.isModalOpen = isOpen;
      let data = {
        users_customers_id:this.userId,
        event_booking_id:this.rest.eventBookingId,
        events_id: this.rest.eventId
      }
      console.log("Refund Req Payload: ",data);
      
      this.rest.presentLoaderWd();
      this.rest.sendRequest('request_refund',data).subscribe((res:any)=>{
        this.rest.dismissLoader();
        console.log("Refund Request Res: ", res);
        if(res.status== 'success'){
          this.rest.presentToast('Refund Request Sent.');
          this.refundRequestCount = 1;
          setTimeout(() => {
            // this.navCtrl.navigateRoot(['/home']);
          }, 1000);
        }else if(res.status == 'error'){
          console.log(res);
          
        }
        
      })
    }else{
      this.rest.presentToast('Refund Request already sent.');

    }

    
  }

  getTime(val:any){
    if(val){
      return val.substring(0,5);
    }
  }
  // goToHome(){
    
  // }
}
