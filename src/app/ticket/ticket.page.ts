import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
  MapMarker,
} from "@angular/google-maps";
import  { Screenshot } from 'capacitor-screenshot';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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
  map!: GoogleMap;
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
    if(this.rest.billDetails?.lattitude){
      let lat = parseFloat(this.rest.billDetails.lattitude)
      let lng = parseFloat(this.rest.billDetails.longitude)
      this.center = {
        lat: lat,
        lng: lng,
      };
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
      // setTimeout(() => {
      //   this.getTicketImages();
      // }, 1000);
      
    }

    // console.log("calling localAssetBase64");
    
    // this.loadLocalAssetToBase64();
  }

  ionViewWillEnter() {
    if(this.rest.billDetails?.event_name){
      this.myAngularxQrCode = `event_name:${this.rest.billDetails.event_name} - venue_name:${this.rest.billDetails.venue_name} - event_date:${this.rest.billDetails.event_date} - event_start_time:${this.rest.billDetails.event_start_time} - event_end_time:${this.rest.billDetails.event_end_time} - package_name:${this.rest.billDetails.package_name} - package_type:${this.rest.billDetails.package_type} - package_price:$${this.rest.billDetails.package_price} - price_per_ticket:$${this.rest.billDetails.price_per_ticket} - ticket_requested:${this.rest.billDetails.ticket_requested} - crowd_fee:$5 - total_bill:$${this.rest.billDetails.total_bill} - location:${this.rest.billDetails.location}`;
    }

    console.log("qrCodeDAta: ", this.myAngularxQrCode);
    
    this.userdata = localStorage.getItem('userdata');
    this.userName = JSON.parse(this.userdata).username;
    this.userId = JSON.parse(this.userdata).users_customers_id;

  }

  // loadLocalAssetToBase64(){
  //   this.http.get('./assets/imgs/icons/crowd_app_icon.jpg',{responseType:'blob'})
  //   .subscribe(res => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       this.logoData = reader.result;
  //     }
  //     reader.readAsDataURL(res);
  //   });
  // }

  onSlideChange(ev:any){
    console.log("Swiper EVVV",ev);
    console.log("active Index is ",ev.detail[0].activeIndex);
    this.activeIndex = ev.detail[0].activeIndex;
    for(let i=0; i<this.tickets.length; i++){
      if(this.activeIndex == i ){
        this.currentTicketToken = this.tickets[i];
      }
    }
  }

  generatePDF(){
    console.log("generatepddfCalled");
    this.rest.presentLoader();
    // this.activeIndex = 1;

    let data1:string = '';
    let data2:string = '';

    if(this.currentTicketToken == undefined){
      this.currentTicketToken = this.tickets[0];
      console.log("iftickeis1 currentTicketToken: ",this.currentTicketToken);
      
    }
    const element: HTMLElement | null = document.getElementById('ticket-p-a');
    if(element !== null){
      html2canvas(element).then((canvas:HTMLCanvasElement)=>{
        data1 = canvas.toDataURL();
        console.log("data1: ",data1);

      });
    }

    setTimeout(() => {
      const element1: HTMLElement | null = document.getElementById('ticket-p-b');
      if(element1 !== null){
        html2canvas(element1).then((canvas:HTMLCanvasElement)=>{
          data2 = canvas.toDataURL();
          console.log("data2: ",data2);

        });
      }
    }, 2000);

    
    setTimeout(() => {
      console.log('currentTicketToken',this.currentTicketToken);
      
      const docDefinition = {
        content: [
          {
            image: data1,
            width: 500
          },
          
          { 
            text: this.currentTicketToken,
            alignment: 'center',
            style: 'header',
            // bold: false
            // margin: [0, 20, 0, 20]
          },
  
          {
            image: data2,
            width: 500
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [10, 10, 10, 10]
          },
          
        }
      };
      // pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
      this.pdfObj = pdfMake.createPdf(docDefinition);
      console.log(this.pdfObj);
      // this.takingScreenshot = false;
      this.downloadPdf();
    }, 4000);
    
    
    // solution: https://github.com/bpampuch/pdfmake/issues/205
    // this.takingScreenshot = true;
    // this.ss = undefined;
    // Screenshot.take().then((ret: { base64: string }) => {
    //   console.log("res:", ret.base64);
    //   this.ss = `data:image/png;base64,${ret.base64}`  // or `data:image/png;base64,${ret.base64}`
    //   console.log("ss:", this.ss);
    // });

    // setTimeout(() => {
    //   this.takingScreenshot = false;
    //   this.rest.presentLoader();
    // }, 1000);


    // setTimeout(() => {
    //   const image = this.ss ? {image: this.ss, width: 300 } : {};

    //   let logo = {};
    //   logo = {image: this.logoData, width: 50};
    //   const docDefinition = {
    //     // watermark: { text: 'Crowd', color: 'blue', opacity: 0.2, bold: true},
    //     content: [
    //       {
    //         columns: [
    //           logo,
    //           {
    //             text: new Date().toString(),
    //             alignment: 'right'
    //           }
    //         ]
    //       },
    //       { text: 'TICKET', style: 'header',  margin: [0, 20, 10, 20]},
    //       // {
    //       //   columns: [
    //       //     {
    //       //       width: '50%',
    //       //       text: 'From',
    //       //       style: 'subheader'
    //       //     },
    //       //     {
    //       //       width: '50%',
    //       //       text: 'To',
    //       //       style: 'subheader'
    //       //     }
    //       //   ]
    //       // },
    //       // {
    //       //   columns: [
    //       //     {
    //       //       width: '50%',
    //       //       text: 'Crowd',
    //       //     },
    //       //     {
    //       //       width: '50%',
    //       //       text: this.userName,
    //       //     },
    //       //   ]
    //       // },
    //       image,
    //       { text: "Thank you.", margin: [0, 20, 0, 20] }
    //     ],
    //     styles: {
    //       header: {
    //         fontSize: 14,
    //         bold: true,
    //         margin: [0, 15, 0, 0]
    //       },
    //       subheader: {
    //         fontSize: 12,
    //         bold: true,
    //         margin: [0, 15, 0, 0]
    //       }
    //     }
    //   }
    //   this.pdfObj = pdfMake.createPdf(docDefinition);
    //   console.log(this.pdfObj);
    //   this.downloadPdf();
    // }, 3000);
    
   
  }

  downloadPdf(){
    if(this.plt.is('capacitor')){
      // this.pdfObj.download();
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
          let payload = {
            event_booking_id: this.rest.eventBookingId,
            ticket_file: data
          }
          console.log(payload);
          
          this.rest.sendRequest("show_ticket",payload).subscribe((res:any)=>{
            console.log("SendPdfAPI RES: ",res);
            // this.navCtrl.navigateRoot(['/home']);
          })
        } catch (error) {
          this.rest.dismissLoader();
          console.log('Unable to write file', error);
        }
      })
      

    }else{

      this.pdfObj.download('ticket.pdf');
      this.rest.dismissLoader();
      // this.navCtrl.navigateRoot(['/home'])
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

  // sendTicketsAtBackend(){
  //   console.log("generatepddfForBacccccckennnnnnnnnnnddddd");
  //   let pdfObj:any;
  //   let currentTicketToken:any;
  //   let tickets = this.tickets;
  //   for(let i=0; i<tickets.length; i++){
  //     // pdfObj = undefined;
  //     currentTicketToken = tickets[i];
  //     setTimeout(() => {
  //       console.log('currentTicketToken',currentTicketToken);
        
  //       const docDefinition = {
  //         content: [
  //           {
  //             image:this.data1,
  //             width: 500
  //           },
            
  //           { 
  //             text: currentTicketToken,
  //             alignment: 'center',
  //             style: 'header',
  //             // bold: false
  //             // margin: [0, 20, 0, 20]
  //           },
    
  //           {
  //             image: this.data2,
  //             width: 500
  //           },
  //         ],
  //         styles: {
  //           header: {
  //             fontSize: 18,
  //             bold: true,
  //             margin: [10, 10, 10, 10]
  //           },
            
  //         }
  //       };
        
  //       pdfObj = pdfMake.createPdf(docDefinition);
  //       console.log("pdfObj for backend: ",pdfObj);
  //     }, 2000);

  //     if(this.plt.is('capacitor')){
        
  //       console.log("capacitor is the platformmmmmmmmm");
  //       pdfObj.getBase64(async (data:any) =>{
         
  //         let payload = {
  //           event_booking_id: this.rest.eventBookingId,
  //           ticket_file: data
  //         }
  //         console.log(payload);
          
  //         this.rest.sendRequest("show_ticket",payload).subscribe((res:any)=>{
  //           console.log("SendPdfAPI RES: ",res);
  //           // this.navCtrl.navigateRoot(['/home']);
  //         })
    
  //       })
        
  
  //     }else{
  
  //       pdfObj.download('ticket.pdf');
        
  //     }
  //   }

   


    

    

    
    

    
  // }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    console.log(isOpen);
    // isOpen = !isOpen
    
    console.log("setopencalled");
    
    this.isModalOpen = isOpen;
  }

  goBack(){
    this.location.back();
  }

  dismissModal(isOpen: boolean){
    this.isModalOpen = isOpen;
    // this.modalCtrl.dismiss();
    setTimeout(() => {
      
      this.navCtrl.navigateRoot(['/home']);
    }, 500);
  }

  reguestRefund(isOpen: boolean){
    
    if(this.refundRequestCount != 1){
      this.isModalOpen = isOpen;
      let data = {
        users_customers_id:this.userId,
        event_booking_id:this.rest.eventBookingId
      }
      this.rest.presentLoaderWd();
      this.rest.sendRequest('request_refund',data).subscribe((res:any)=>{
        this.rest.dismissLoader();
        console.log("Refund Request Res: ", res);
        if(res.status== 'success'){
          this.rest.presentToast('Refund Request Sent for all tickets.');
          this.refundRequestCount = 1;
          setTimeout(() => {
            // this.navCtrl.navigateRoot(['/home']);
          }, 1000);
        }else if(res.status == 'error'){
          console.log(res);
          
        }
        
      })
    }else{
      this.rest.presentToast('Refund Request already sent for all tickets.');

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
