import { ModalController, Platform } from "@ionic/angular";
import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CancelbookPage } from "../cancelbook/cancelbook.page";
import { RestService } from "../rest.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { format, parse } from "date-fns";

@Component({
  selector: "app-booking1event",
  templateUrl: "./booking1event.page.html",
  styleUrls: ["./booking1event.page.scss"],
})
export class Booking1eventPage implements OnInit {
  userId:any;
  userdata: any = "";
  visitorArr: any = "";
  selectedEvent: any = "";
  latitude: any;
  businessList:any;
  organizer:any = {
    first_name: null,
    user_image: null,
    users_business_id: null,
  };
  longitude: string | null | undefined;
  availableTickets: any ;
  allTicketsSold = false;
  isModalOpen = false;
  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public modalCtrl: ModalController,
    public iab: InAppBrowser,
    public platform: Platform
  ) {}

  ionViewWillEnter() {

    this.userdata = localStorage.getItem('userdata');
    this.userId = JSON.parse(this.userdata).users_customers_id;
    this.latitude = localStorage.getItem('lattitude');
    this.longitude = localStorage.getItem('longitude');
    
    this.selectedEvent = this.rest.detail;
    console.log("detaill----", this.selectedEvent);
    this.availableTickets = this.selectedEvent.no_of_tickets - this.selectedEvent.booked_tickets; 
    console.log("Available Tickets: ",this.availableTickets);
    if(this.availableTickets < 1){
      this.allTicketsSold = true;
    }

    let currentDate = new Date();
    console.log("currentDate: ",currentDate);
    let eventDate = new Date(this.selectedEvent.event_date);
    console.log(" eventDate:  ",eventDate);

    this.getBusinessList();
    setTimeout(() => {
      // if(this.availableTickets < 1 || eventDate < currentDate){
      if(this.availableTickets < 1){
        // this.allTicketsSold = true;
        this.rest.presentToast('All tickets are sold out.')
      }
    }, 1000);

  }

  ngOnInit() {}

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  getBusinessList(){
    this.rest.presentLoader();
    this.rest.getRequest('get_business_list').subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Ress:", res);
      if(res.status=='success'){
        // this.businessList = res.data;
        console.log("Organizer Data before: ",this.organizer);
        for(let i=0; i<res.data.length; i++){
          if(this.selectedEvent.users_business_id == res.data[i].users_business_id){
            this.organizer = res.data[i];
            this.rest.business_owner_name = this.organizer.first_name;            
          }
        }
      }
      console.log("Organizer Data: ",this.organizer);
    },(err)=>{
      this.rest.dismissLoader();
      console.log("Errr: ",err);
      
    })
  }
  goBack() {
    this.location.back();
  }

  gotoOrganizerEvents(){
    this.rest.orgEventsArr = [];
    let data = {
      users_business_id:this.selectedEvent.users_business_id,
      users_customers_id:this.userId,
      longitude:this.longitude,
      lattitude:this.latitude,
      page_number:"1"
    }
    console.log("Api dataa: ",data);
    this.rest.presentLoader();
    this.rest.sendRequest('get_business_events',data).subscribe((res:any)=>{
      this.rest.dismissLoader();
      console.log("Org events REssssss: ",res);
      
      this.rest.orgEventsArr = res.data;
      this.router.navigate(['/organizer-events']);
      
    },(err)=>{
      this.rest.dismissLoader();
      console.log("errrr: ",err);
      
    })
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
  dismissModal(){
    this.isModalOpen = false;
    this.modalCtrl.dismiss();
  }
  setModalValue(){
    this.isModalOpen = false;
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
    this.router.navigate(["booking2event"]);
  }
}
