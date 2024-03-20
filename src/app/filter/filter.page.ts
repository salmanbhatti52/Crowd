import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgZone } from "@angular/core";
import { ModalController } from "@ionic/angular";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@awesome-cordova-plugins/native-geocoder/ngx";
import { MapGeocoder, MapGeocoderResponse } from "@angular/google-maps";
declare var google: any;

// import { CalendarComponentOptions } from "ion2-calendar";
import {format, parseISO,addDays,isDate, getDate,getMonth,getYear} from 'date-fns';
import { RestService } from "../rest.service";
@Component({
  selector: "app-filter",
  templateUrl: "./filter.page.html",
  styleUrls: ["./filter.page.scss"],
})
export class FilterPage implements OnInit {
  GoogleAutocomplete = new google.maps.places.AutocompleteService();
  autocompleteItems: any;

  @ViewChild("search")
  public searchElementRef!: ElementRef;

  minDate = format(parseISO(new Date().toISOString()),'yyyy-MM-dd');
  // myDate: any = format(parseISO(new Date().toISOString()),'yyyy-MM-dd');
  // userdate: any = "";
  cityArr = [
    {
      id: 1,
      usercity: "Multan",
    },
    {
      id: 2,
      usercity: "Mailsi",
    },
    {
      id: 3,
      usercity: "Muzafargarh",
    },
  ];

  catArr = [
    {
      id: 1,
      catname: "category 1",
    },
    {
      id: 1,
      catname: "category 2",
    },
    {
      id: 1,
      catname: "category 3",
    },
    {
      id: 1,
      catname: "category 4",
    },
    {
      id: 1,
      catname: "category 5",
    },
  ];

  usercityShow = false;
  userdateShow = false;
  userCatShow = false;

  userdate = "Date";
  userCategory = "Category";

  // optionsRange: CalendarComponentOptions = {
  //   pickMode: "range",
  // };
  usercity = "Search City";
  date: string = "";
  type = "string"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  latitude: any;
  longitude: any;
  currentaddress: any;
  from: any;
  userId: any;
  address:any;
  constructor(public modalCtrl: ModalController, public router: Router,
    private ngZone: NgZone,
    public rest: RestService,
    private geoCoder: MapGeocoder) {}

  

  ngOnInit() {
    
  }
  ionViewWillEnter(){
    let userdata = localStorage.getItem('userdata');
    this.userId = JSON.parse(userdata!).users_customers_id;
    console.log('userid', this.userId);
  }

  

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );

    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        console.log("placeeeeee",place);
        
        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log("place and geometery locationnnnnnn lat: ",{ place }, place.geometry.location?.lat());
        console.log("place and geometery locationnnnnnn lng: ",{ place }, place.geometry.location?.lng());

        this.latitude = this.roundOffLatLong(place.geometry.location?.lat()) ;
        this.longitude = this.roundOffLatLong(place.geometry.location?.lng());
        console.log(this.latitude);
        console.log(this.longitude);
       
        if(place?.name === place?.vicinity){
          
          this.address = place?.formatted_address;
          
        }else{
          this.address = place?.name + ", " + place?.vicinity;
          
        }

        console.log("curr addr===", this.address);
        
      });
    });
  }

  roundOffLatLong(val:any){
    return Number.parseFloat(val).toFixed(7);

  }

  getCurrentLocation() {
    this.latitude = undefined;
    this.longitude = undefined;
    console.log("getCurrentLocationCalled");
    this.rest.presentLoaderWd();
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("position: ",position);
      
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.rest.dismissLoader();
      this.getAddress();
     
    },(err)=>{
      console.log("errrr: ", err);
      
    });
    setTimeout(() => {
      if(!(this.latitude || this.longitude)){
        this.rest.presentToast("Plz check your device location is on");
        
      }
    }, 3500);

  }

  getAddress() {
    let address:any;
    this.rest.presentLoaderWd();
    this.geoCoder
      .geocode({ location: { lat: this.latitude, lng: this.longitude } })
      .subscribe(
        (addr: MapGeocoderResponse) => {
          this.rest.dismissLoader();
          console.log("Addressss: ",addr);
          address = addr;
          
          if (address.status === "OK") {
            if (address.results.length) {
              for(let i = 0; i<address.results.length; i++){ 
                if(address.results[i].types.length == 3){
                  console.log("address found===", address.results[i].formatted_address);
                  this.address = address.results[i].formatted_address;
                }
              }
              console.log("curr addr===", this.address);

              // localStorage.setItem("location", this.currentaddress);
              // localStorage.setItem("longitude", this.longitude);
              // localStorage.setItem("lattitude", this.latitude);
            } else {
              this.address = "";
              window.alert("No results found");
            }
          } else {
            this.address = "";
            window.alert("Geocoder failed due to: " + addr.status);
          }
        },
        (err) => {
          console.log("Errrrr",err);
          
          this.rest.dismissLoader();
        }
      );
  }

  hideShowuserdate() {
    if (this.userdateShow) {
      this.userdateShow = false;
    } else {
      this.userdateShow = true;
    }
  }

  closeModel(){
    this.modalCtrl.dismiss();
  }

  formattedString(dateVal:any){
    this.userdate = format(parseISO(dateVal), 'yyyy-MM-dd');
    console.log(this.userdate);
  }

  filterEvents() {
    if((this.address == '' || this.address == undefined) && this.userdate == "Date"){
      this.rest.presentToast('Plz add some input for filter');
    }

    // else if(this.userdate == "Date" || this.userdate == undefined){
    //   this.rest.presentToast('Plz select date')
    // }
    else{
      let data = {
        address: this.address,
        eventDate: this.userdate,
      }
      console.log('filter data:',data);
      
      this.modalCtrl.dismiss(data, 'success');
      // let data = {
      //   users_customers_id:this.userId,
      //   longitude:this.longitude,
      //   lattitude:this.latitude,
      //   page_number:"1",
      //   event_date:this.userdate,
      //   location:this.address
      // }
      // let filteredEvents:any[]
      // console.log("api data:",data);
      // this.rest.presentLoader();
      // this.rest.sendRequest('events_search',data).subscribe((res:any)=>{
      //   this.rest.dismissLoader();
      //   console.log("Events Search Response",res);
      //   if(res.status=='success'){
      //     this.rest.presentToast(res.status);
      //     filteredEvents = res.data;
      //     this.modalCtrl.dismiss(filteredEvents, 'success');
      //   }else if(res.status == 'error'){
      //     this.rest.presentToast(res.message);
      //     this.modalCtrl.dismiss(filteredEvents, 'error');
      //   }
      // },(err)=>{
      //   this.rest.dismissLoader();
      //   console.log("Errrr: ",err);
      //   this.modalCtrl.dismiss();
      // })
      
    }
    
  }
}
