import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestService } from '../rest.service';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
  MapMarker,
} from "@angular/google-maps";


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {
  myAngularxQrCode: string = ''
  userdata: any;
  userName: any;
  @ViewChild("myGoogleMap", { static: false })
  map!: GoogleMap;
  zoom = 13;
  maxZoom = 15;
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
  constructor(public location:Location,
    public modalCtrl:ModalController,
    public router:Router,
    public rest:RestService) { }

  async ngOnInit() {
    let lat = parseFloat(this.rest.billDetails.lattitude)
    let lng = parseFloat(this.rest.billDetails.longitude)
    this.center = {
      lat: lat,
      lng: lng,
    };
  }

  ionViewWillEnter() {
    this.myAngularxQrCode = `event_name:${this.rest.billDetails.event_name} - venue_name:${this.rest.billDetails.venue_name} - event_date:${this.rest.billDetails.event_date} - event_start_time:${this.rest.billDetails.event_start_time} - event_end_time:${this.rest.billDetails.event_end_time} - package_name:${this.rest.billDetails.package_name} - package_type:${this.rest.billDetails.package_type} - package_price:$${this.rest.billDetails.package_price} - price_per_ticket:$${this.rest.billDetails.price_per_ticket} - ticket_requested:${this.rest.billDetails.ticket_requested} - crowd_fee:$5 - total_bill:$${this.rest.billDetails.total_bill} - location:${this.rest.billDetails.location}`;
    console.log("qrCodeDAta: ", this.myAngularxQrCode);
    
    this.userdata = localStorage.getItem('userdata');
    this.userName = JSON.parse(this.userdata).username;
  }
  goBack(){
    this.location.back();
  }
  dismissModal(){
    this.modalCtrl.dismiss();
    this.router.navigate(['/home']);
  }

  getTime(val:any){
    if(val){
      return val.substring(0,5);
    }
  }
  // goToHome(){
    
  // }
}
