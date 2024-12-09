import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-detail',
  templateUrl: './weather-detail.page.html',
  styleUrls: ['./weather-detail.page.scss'],
})
export class WeatherDetailPage implements OnInit {
  showWeather: boolean = false;

  constructor(public location:Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }

  closeNewModel(){
    this.showWeather = false;
  }

  showWeatherFunc(){
    this.showWeather = true;
  }

}
