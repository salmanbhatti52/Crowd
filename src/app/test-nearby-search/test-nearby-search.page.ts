import { Component, OnInit } from '@angular/core';
let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;

declare global {
  interface Window {
    initMap: () => void;
  }
}

@Component({
  selector: 'app-test-nearby-search',
  templateUrl: './test-nearby-search.page.html',
  styleUrls: ['./test-nearby-search.page.scss'],
})
export class TestNearbySearchPage implements OnInit {
  window = this.initMap;
  constructor() { }

  ngOnInit() {
  }

  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

  

   initMap(): void {
    const sydney = new google.maps.LatLng(-33.867, 151.195);

    infowindow = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: sydney,
      zoom: 15,
    });

    const request = {
      query: "Museum of Contemporary Art Australia",
      fields: ["name", "geometry"],
    };

    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(
      request,
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          console.log("resss....",results);
          console.log("status....",results);
          
          for (let i = 0; i < results.length; i++) {
            // createMarker(results[i]);
          }

          map.setCenter(results[0].geometry!.location!);
        }
      }
    );
  }

  // createMarker(place: google.maps.places.PlaceResult) {
  //   if (!place.geometry || !place.geometry.location) return;

  //   const marker = new google.maps.Marker({
  //     map,
  //     position: place.geometry.location,
  //   });

  //   google.maps.event.addListener(marker, "click", () => {
  //     infowindow.setContent(place.name || "");
  //     infowindow.open(map);
  //   });
  // }

  

}
