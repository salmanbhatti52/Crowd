import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parse } from "date-fns";

@Component({
  selector: "app-booking2event",
  templateUrl: "./booking2event.page.html",
  styleUrls: ["./booking2event.page.scss"],
})
export class Booking2eventPage implements OnInit {
  userdata: any = "";
  visitorArr: any = "";
  selectedEvent: any = "";
  p4p1 = false;
  p4p2 = false;
  p6p1 = false;
  p6p2 = false;
  packagePrice = 0;
  packageType = '';
  packageName = '';
  totalTickets = 0;
  pricePerTicket = 0;
  prePayPercentage= 0;
  ticketRequested = 0;
  vipTicketRequested = 0;
  totalBill = 0;
  availableTickets = 0;
  showStandardTicketInfo = false;
  showTicketExtras = false;
  showTablePackages = false;
  selectedExtrasPackage : number = 0;
  selectedTablePackage : number = 0;
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform
  ) {}

  ionViewWillEnter() {
    this.selectedEvent = this.rest.detail;
    this.totalTickets = this.selectedEvent.no_of_tickets;
    console.log("detaill----", this.selectedEvent);
    this.pricePerTicket = this.convertInDecimal(this.selectedEvent.price_per_ticket);
    console.log("price_per_ticket",this.pricePerTicket);
    this.availableTickets = this.selectedEvent.no_of_tickets - this.selectedEvent.booked_tickets; 
    console.log("Available Tickets: ",this.availableTickets);
    
  }

  showStandardTicketDetail(){
    this.showStandardTicketInfo = !this.showStandardTicketInfo;
  }

  showTicketExtrasFunc(){
    
    if(this.showTicketExtras){
      this.showTablePackages = false;
      this.showTicketExtras = false;
    }else{
      this.showTicketExtras = true;
      this.showTablePackages = false;
    }
    // this.showTicketExtras = !this.showTicketExtras;
    // this.showTablePackages = !this.showTablePackages;

  }
  
  showTablePackagesFunc(){
    if(this.showTablePackages){
      this.showTicketExtras = false;
      this.showTablePackages = false;
    }else{
      this.showTablePackages = true;
      this.showTicketExtras = false;
    }
    // this.showTablePackages = !this.showTablePackages;
    // this.showTicketExtras = !this.showTicketExtras;

  }

  selectTablePackage(input: number){
    this.selectedTablePackage = input;
    console.log(this.selectedTablePackage);
    this.selectPackage('abc','25.75')
  }

  selectExtrasPackage(input: number){
    this.selectedExtrasPackage = input;
    console.log(this.selectedExtrasPackage);

  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  incrementStandardTickets(){
    if(this.ticketRequested < this.availableTickets){
      this.ticketRequested++;
    }else{
      this.rest.presentToast(`Max available tickets are ${this.availableTickets}.`);
    }
    console.log("tickets requested", this.ticketRequested);
    this.calculateTotalAmount();
  }

  decrementStandardTickets(){
    if(this.ticketRequested>0){
      this.ticketRequested--;
    }
    console.log("tickets requested", this.ticketRequested);
    this.calculateTotalAmount();
  }

  incrementVipTickets(){
    // if(this.ticketRequested < this.availableTickets){
      this.vipTicketRequested++;
    // }else{
    //   this.rest.presentToast(`Max available tickets are ${this.availableTickets}.`);
    // }
    // console.log("tickets requested", this.ticketRequested);
    // this.calculateTotalAmount();
  }

  decrementVipTickets(){
    if(this.vipTicketRequested>0){
      this.vipTicketRequested--;
    }
    // console.log("tickets requested", this.ticketRequested);
    // this.calculateTotalAmount();
  }

  selectPackage(val:any,price:any){
    this.packagePrice = this.convertInDecimal(price);
    this.calculateTotalAmount();
    this.packageType = 'Table for 4'
    this.packageName = 'Drinking Package 2'
    // if(val == 'p4p2'){
    //   this.p4p1 = false;
    //   this.p4p2 = true;
    //   this.p6p1 = false;
    //   this.p6p2 = false;
    //   this.packagePrice = this.convertInDecimal(price);
    //   this.calculateTotalAmount();
    //   this.packageType = 'Table for 4'
    //   this.packageName = 'Drinking Package 2'
    // }else if(val == 'p6p1'){
    //   this.p4p1 = false;
    //   this.p4p2 = false;
    //   this.p6p1 = true;
    //   this.p6p2 = false;
    //   this.packagePrice = this.convertInDecimal(price);
    //   this.calculateTotalAmount();
    //   this.packageType = 'Table for 6'
    //   this.packageName = 'Drinking Package 1'
    // }else if(val == 'p6p2'){
    //   this.p4p1 = false;
    //   this.p4p2 = false;
    //   this.p6p1 = false;
    //   this.p6p2 = true;
    //   this.packagePrice = this.convertInDecimal(price);
    //   this.calculateTotalAmount();
    //   this.packageType = 'Table for 6'
    //   this.packageName = 'Drinking Package 2'
    // }else{
    //   this.p4p1 = true;
    //   this.p4p2 = false;
    //   this.p6p1 = false;
    //   this.p6p2 = false;
    //   this.packagePrice = this.convertInDecimal(price);
    //   this.calculateTotalAmount();
    //   this.packageType = 'Table for 4'
    //   this.packageName = 'Drinking Package 1'
    // }
    
  }

  calculateTotalAmount(){
    this.totalBill = 0;
    console.log("price",this.packagePrice);
    console.log("ticketRequested", this.ticketRequested);
    console.log("pricePerTicket", this.pricePerTicket);
    
    if(this.ticketRequested){
      this.totalBill = this.ticketRequested * this.pricePerTicket + this.packagePrice;
      this.totalBill = this.convertInDecimal(this.totalBill);
      console.log("total_bill_with_Dec",this.totalBill);
      
    }else if(this.packagePrice){
      this.totalBill = this.packagePrice;
    }else{

    }

  }

  convertInDecimal(x:any) {
    let decimalString =  Number.parseFloat(x).toFixed(2);
    console.log("dec str: ", decimalString);
    return Number.parseFloat(decimalString);
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
      return format(new Date(val), 'E, do MMM');
    }
    else{
      return val;
    }
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }

  async cancelBooking() {
    console.log("model");
    const modal = await this.modalCtrl.create({
      component: CancelbookPage,
      cssClass: "riz",
    });

    await modal.present();
  }

  goToChat() {
    this.router.navigate(["chat"]);
  }

  openBrowserLink() {
    console.log("opennnnn");

    this.iab.create(this.selectedEvent.website, "_blank");
  }

  public goLocation() {
    // window.open("https://www.google.com/maps/search/?api=1&query=6.424580,3.441100")
    var geocoords =
      this.selectedEvent.lattitude + "," + this.selectedEvent.longitude;

    if (this.platform.is("ios")) {
      window.open("maps://?q=" + geocoords, "_system");
    } else {
      var label = encodeURI(this.selectedEvent.location); // encode the label!
      window.open("geo:0,0?q=" + geocoords + "(" + label + ")", "_system");

      // window.open("https://www.google.com/maps/search/?api=1&query=" + geocoords)
    }
  }

  buyTicket() {
    console.log("buy");
  }

  goToNext() {
    if(this.ticketRequested)
    {
      if(this.ticketRequested<=0){
        this.rest.presentToast('Plz enter number of ticket/tickets');
      }else if(this.packagePrice == 0){
        this.rest.presentToast('Plz select the package');
      }else{
        let ticketBill:any = this.ticketRequested * this.pricePerTicket;
       ticketBill = Number.parseFloat(ticketBill.toString()).toFixed(2);
        let data = {
          ticket_requested: this.ticketRequested,
          ticket_bill: ticketBill,
          price_per_ticket:this.pricePerTicket,
          package_type: this.packageType,
          package_name: this.packageName,
          package_price: this.packagePrice,
          total_bill: this.totalBill,
          event_id: this.selectedEvent.events_id,
          user_business_id: this.selectedEvent.users_business_id,
          event_name: this.selectedEvent.name,
          event_date: this.selectedEvent.event_date,
          event_start_time: this.selectedEvent.event_start_time,
          event_end_time: this.selectedEvent.event_end_time,
          lattitude: this.selectedEvent.lattitude,
          longitude: this.selectedEvent.longitude,
          location: this.selectedEvent.location,
          venue_name: this.selectedEvent.venue_name
        }
        console.log("Bill Details",data);
        this.rest.billDetails = data;
        this.rest.comingFrom = 'booking2event'
        this.router.navigate(["booking3event"]);
        
      }
      
    }else{
      this.rest.presentToast('Plz enter number of ticket/tickets');
    }
  }
}
