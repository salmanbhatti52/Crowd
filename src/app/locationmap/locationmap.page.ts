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

  filtertype = "no";

  searchObject: any = "";

  markerscheck = [
    {
      coordinate: {
        lat: 30.2396588,
        lng: 71.4848884,
      },
      snippet: "1",
      title: "test venue",
    },
    {
      coordinate: {
        lat: 30.208124,
        lng: 71.4699251,
      },
      snippet: "2",
      title: "test venue",
    },
    {
      coordinate: {
        lat: 30.2164073,
        lng: 71.462651,
      },
      snippet: "hellow i am here dear",
      title: "test venue",
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
      apiKey: "AIzaSyA7ks8X2YnLcxTuEC3qydL2adzA0NYbl6c", // Your Google Maps API Key
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
      this.filterArrypin(marker.title);
    });
    this.map.setOnInfoWindowClickListener(async (marker: any) => {
      console.log("info", marker);
    });
  }

  tab1Click() {
    this.HideFilter();
    this.router.navigate(["home"]);
  }
  tab2Click() {
    this.HideFilter();
    this.router.navigate(["locationmap"]);
  }
  tab3Click() {
    this.HideFilter();
    this.router.navigate(["saved"]);
  }
  tab4Click() {
    this.HideFilter();
    this.router.navigate(["noti"]);
  }
  goToProfile() {
    this.HideFilter();
    this.router.navigate(["profile"]);
  }

  goToDetail() {
    this.HideFilter();
    this.router.navigate(["venuedetail"]);
  }

  clearFilter() {
    this.HideFilter();
    this.filtertype = "no";
    this.venuarr = this.venuarrOrg;
    console.log("133---", this.venuarr);
  }

  showHideFilter(item: any) {
    this.searchAndFilterItems(item);

    this.filtertype = item;

    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }
  }

  showHideFilterN() {
    if (this.showfilter) {
      this.showfilter = false;
    } else {
      this.showfilter = true;
    }
  }

  searchAndFilterItems(searchTerm: any) {
    this.venuarr = [];
    for (var i = 0; i < this.venuarrOrg.length; i++) {
      console.log("156");

      if (
        this.venuarrOrg[i].availability.toLowerCase() ==
        searchTerm.toLowerCase()
      ) {
        this.venuarr.push(this.venuarrOrg[i]);
      }
    }
    console.log("item------152", this.venuarr);

    var newVenuArr = [];
    for (var i = 0; i < this.venuarr.length; i++) {
      console.log("168");

      var obj = {
        coordinate: {
          lat: this.venuarr[i].lattitude,
          lng: this.venuarr[i].longitude,
        },
        snippet: "1",
        title: this.venuarr[i].name,
      };

      newVenuArr.push(obj);
    }
    this.venuarr = [];
    this.venuarr = newVenuArr;
    console.log("item------166", this.venuarr);
    console.log("itemOrg------166", this.venuarrOrg);
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

    console.log("item------148", this.venuarr);
    // this.markerscheck = this.venuarr;
  }

  HideFilter() {
    this.showfilter = false;
  }

  filterArrypin(searchTerm: any) {
    console.log("searchTerm---", searchTerm);

    for (var i = 0; i < this.venuarrOrg.length; i++) {
      console.log("156");

      if (this.venuarrOrg[i].name.toLowerCase() == searchTerm.toLowerCase()) {
        this.searchObject = this.venuarrOrg[i];
      }
    }
    console.log("searchObject------224ali", this.searchObject);
  }

  gotodetail() {
    this.HideFilter();
    console.log(this.searchObject);
    this.rest.detail = this.searchObject;
    this.router.navigate(["venuedetail"]);
  }

  mapClick() {
    console.log("mapclick");
  }
}
