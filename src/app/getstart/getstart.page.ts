import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Location } from "@angular/common";
import { RestService } from "../rest.service";

import { NgZone } from "@angular/core";
import { Geolocation } from "@awesome-cordova-plugins/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@awesome-cordova-plugins/native-geocoder/ngx";

import { AlertController } from "@ionic/angular";

import { Platform } from "@ionic/angular";
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

  locationishidden: boolean = false;
  constructor(
    public router: Router,
    public restService: RestService,
    public locationBk: Location,
    private nativeGeocoder: NativeGeocoder,
    private zone: NgZone,
    public alertcontroller: AlertController,
    public platform: Platform
  ) {
    if (this.platform.is("ios")) {
      this.platformcheck = "ios";
    } else {
      this.platformcheck = "android";
    }
  }

  ngOnInit() {}

  goToHome() {
    if (this.from == "") {
      this.restService.presentToast("Please enter the location");
    } else {
      this.router.navigate(["home"]);
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
    this.nativeGeocoder
      .forwardGeocode(this.location)
      .then((result: NativeGeocoderResult[]) => {
        this.latitude = result[0].latitude;
        this.longitude = result[0].longitude;
        console.log(
          "The coordinates are latitude=" +
            result[0].latitude +
            " and longitude=" +
            result[0].longitude
        );

        localStorage.setItem("location", this.location);
        localStorage.setItem("longitude", result[0].longitude);
        localStorage.setItem("lattitude", result[0].latitude);

        alert(
          "The coordinates are latitude=" +
            result[0].latitude +
            " and longitude=" +
            result[0].longitude
        );
      })
      .catch((error: any) => console.log(error));
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
          this.zone.run(() => {
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
}
