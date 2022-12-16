import { RestService } from "./../rest.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { GoogleMap } from "@capacitor/google-maps";

@Component({
  selector: "app-locationmap",
  templateUrl: "./locationmap.page.html",
  styleUrls: ["./locationmap.page.scss"],
})
export class LocationmapPage implements OnInit {
  showfilter = false;

  @ViewChild("map") mapRef: any = ElementRef;
  map: any = GoogleMap;
  title = "Title here";
  venuarr: any = "";
  venuarrOrg: any = "";

  markerscheck = [
    {
      coordinate: {
        lat: 30.2396588,
        lng: 71.4848884,
      },
      snippet: "1",
      title: "Kozi haleem 6 number",
    },
    {
      coordinate: {
        lat: 30.208124,
        lng: 71.4699251,
      },
      snippet: "2",
      title: "Bundu khan multan",
    },
    {
      coordinate: {
        lat: 30.2164073,
        lng: 71.462651,
      },
      snippet: "hellow i am here dear",
      title: "9 number hotel",
    },
  ];

  constructor(public router: Router, public rest: RestService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.createMap();
  }

  ionViewWillEnter() {
    this.venuarrOrg = this.rest.venuArrHome;

    this.makeMarkerArray();
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.map.destroy();
  }

  async createMap() {
    // AIzaSyAncWVozZi9mUrnaxdDJJE_rgRY5M-wD54
    this.map = await GoogleMap.create({
      id: "my-map", // Unique identifier for this map instance
      element: this.mapRef?.nativeElement, // reference to the capacitor-google-map element
      apiKey: "AIzaSyAncWVozZi9mUrnaxdDJJE_rgRY5M-wD54", // Your Google Maps API Key
      forceCreate: true,
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: 30.2398469,
          lng: 71.4703882,
        },

        zoom: 12, // The initial zoom level to be rendered by the map
      },
    });

    this.addmarkers();
  }

  async addmarkers() {
    await this.map.addMarkers(this.markerscheck);
    this.map.setOnMarkerClickListener(async (marker: any) => {
      console.log(marker);
      this.title = marker.title;
    });
    this.map.setOnInfoWindowClickListener(async (marker: any) => {
      console.log("info", marker);
    });
  }

  tab1Click() {
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.router.navigate(["noti"]);
  }
  goToProfile() {
    this.router.navigate(["profile"]);
  }

  showHideFilter() {
    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }
  }

  searchAndFilterItems(searchTerm: any) {
    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      if (
        this.venuarrOrg[i].availability.toLowerCase() ==
        searchTerm.toLowerCase()
      ) {
        this.venuarr.push(this.venuarrOrg[i]);
      }
    }

    console.log("item------", this.venuarr);
  }

  makeMarkerArray() {
    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      var obj = {
        coordinate: {
          lat: this.venuarrOrg[i].lattitude,
          lng: this.venuarrOrg[i].longitude,
        },
        snippet: "1",
        title: this.venuarrOrg[i].name,
      };

      this.venuarr.push(obj);
    }

    console.log("item------", this.venuarr);
    // this.markerscheck = this.venuarr;
  }
}
