import { RestService } from "./../rest.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { Location } from "@angular/common";

import { NgZone } from "@angular/core";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@awesome-cordova-plugins/native-geocoder/ngx";

import { AlertController } from "@ionic/angular";

import { Platform } from "@ionic/angular";
import { MapGeocoder, MapGeocoderResponse } from "@angular/google-maps";
// import { google } from "google-maps";

declare var google: any;

@Component({
  selector: "app-getstart",
  templateUrl: "./getstart.page.html",
  styleUrls: ["./getstart.page.scss"],
})
export class GetstartPage implements OnInit {
  GoogleAutocomplete = new google.maps.places.AutocompleteService();
  autocompleteItems: any;

  listishiddenFrom = true;
  latitude: any;
  longitude: any;
  location: any;
  placeid: any;
  from: any = "";
  platformcheck: any = "android";

  @ViewChild("search")
  public searchElementRef!: ElementRef;

  placenewali: any;
  title: string = "AGM project";

  locationishidden: boolean = false;
  currentaddress: any;
  constructor(
    public router: Router,
    public restService: RestService,
    public locationBk: Location,
    private nativeGeocoder: NativeGeocoder,
    private ngZone: NgZone,
    public alertcontroller: AlertController,
    public platform: Platform,
    public rest: RestService,
    private geoCoder: MapGeocoder
  ) {
    if (this.platform.is("ios")) {
      this.platformcheck = "ios";
    } else {
      this.platformcheck = "android";
    }
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );

    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();

        localStorage.setItem(
          "location",
          JSON.stringify(place.geometry.location?.lat())
        );
        localStorage.setItem("longitude", this.longitude);
        localStorage.setItem("lattitude", this.latitude);

        // alert(
        //   "----lat----" +
        //     this.latitude +
        //     "----long----" +
        //     this.longitude +
        //     "formatted_address----" +
        //     place.formatted_address
        // );

        // Set marker position
      });
    });
  }

  goToHome() {
    console.log("from--", this.from);
    console.log(
      "localStorage.getItem('longitude')--",
      localStorage.getItem("longitude")
    );
    // return;

    if (this.from) {
      if (localStorage.getItem("longitude")) {
        this.router.navigate(["home"]);
      } else {
        this.restService.presentToast("Please enter the location.");
      }
    } else {
      this.restService.presentToast("Please enter the location.");
    }
  }

  selectSearchResultFrom(item: any) {
    this.listishiddenFrom = true;
    this.autocompleteItems = [];
    console.log("itemmmmmmmmmmmmmmmmmmmmmmmmm", item);
    this.location = item;
    this.from = this.location.description;
    this.listishiddenFrom = true;
    console.log("location", this.location.latitude);
    this.placeid = this.location.place_id;
    console.log("placeid" + this.placeid);
    this.location = item.description;
    console.log("aaaaaaaaaaaaaaaaaaa", this.location);

    this.rest.presentLoader();

    this.nativeGeocoder
      .forwardGeocode(this.location)
      .then((result: NativeGeocoderResult[]) => {
        this.latitude = result[0].latitude;
        this.longitude = result[0].longitude;

        this.rest.dismissLoader();
        console.log(
          "The coordinates are latitude=" +
            result[0].latitude +
            " and longitude=" +
            result[0].longitude
        );

        localStorage.setItem("location", this.location);
        localStorage.setItem("longitude", result[0].longitude);
        localStorage.setItem("lattitude", result[0].latitude);

        // alert(
        //   "Simple The coordinates are latitude=" +
        //     result[0].latitude +
        //     " and longitude=" +
        //     result[0].longitude
        // );

        // alert(
        //   "Localstorage The coordinates are latitude=" +
        //     localStorage.getItem("longitude") +
        //     " and longitude=" +
        //     localStorage.getItem("lattitude") +
        //     " and location=" +
        //     localStorage.getItem("location")
        // );
      })
      .catch((error: any) => {
        this.rest.dismissLoader();
        console.log(error);
      });
  }

  updateSearchResultsEventFrom(ev: any) {
    console.log(ev);
    if (ev.target.value.length > 0) {
      console.log(
        "greatrtt    00000000000",
        ev.detail.value,
        ev.target.value.length
      );
      this.listishiddenFrom = false;
      this.GoogleAutocomplete.getPlacePredictions(
        { input: this.from },
        (predictions: any, status: any) => {
          this.autocompleteItems = [];
          this.ngZone.run(() => {
            predictions.forEach((prediction: any) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      );
    } else {
      console.log("eeeeeeeeeeeeeeeeeeeeeeeee", ev.detail.value);
      this.listishiddenFrom = true;
      console.log("khaallllllooiiiiiiiiiii");
      this.locationishidden = false;
      this.location = "";
      this.autocompleteItems = [];
      console.log("lllllllllllllllll", this.location);
    }
  }

  getCurrentLocatiuon() {
    console.log("getCurrentLocatiuon()");
    this.rest.presentLoaderWd();
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.rest.dismissLoader();
      this.getAddress(this.latitude, this.longitude);
    });
  }

  getAddress(latitude: any, longitude: any) {
    console.log("lat======", latitude);
    console.log("long======", longitude);
    this.rest.presentLoaderWd();
    this.geoCoder
      .geocode({ location: { lat: latitude, lng: longitude } })
      .subscribe(
        (addr: MapGeocoderResponse) => {
          this.rest.dismissLoader();
          if (addr.status === "OK") {
            if (addr.results[0]) {
              console.log("addr======", addr.results[0].formatted_address);

              this.currentaddress = addr.results[0].formatted_address;
              this.from = this.currentaddress;
              localStorage.setItem("location", this.currentaddress);
              localStorage.setItem("longitude", longitude);
              localStorage.setItem("lattitude", latitude);
            } else {
              this.currentaddress = "";
              window.alert("No results found");
            }
          } else {
            this.currentaddress = "";
            window.alert("Geocoder failed due to: " + addr.status);
          }
        },
        (err) => {
          this.rest.dismissLoader();
        }
      );
  }
}
