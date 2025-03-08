import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { parseISO, format, getDate } from 'date-fns';

@Component({
  selector: 'app-weather-detail',
  templateUrl: './weather-detail.page.html',
  styleUrls: ['./weather-detail.page.scss'],
})
export class WeatherDetailPage implements OnInit {
  showWeather: boolean = false;
  currentWeather: any;
  weatherForecast: any;
  constructor(public location: Location, public rest: RestService) {
    this.currentWeather = this.rest.currentWeather;
    this.weatherForecast = this.rest.weatherForecast;
  }

  weeklyWeatherForecast: any = [];
  selectedDayWeatherForecast: any = [];
  selectedWeatherDay: any;
  selectedDayInfo: any;
  ngOnInit() {

  }

  ionViewWillEnter() {
    this.customiseWeatherForecast();
  }

  customiseWeatherForecast() {
    console.log('customiseWeatherForecast');

    console.log(this.weatherForecast);

    for (let index = 0; index < this.weatherForecast.list.length; index++) {
      const element = this.weatherForecast.list[index];
      const dayName = format(parseISO(element.dt_txt), 'eee');
      const dayTime = format(parseISO(element.dt_txt), 'h a');
      const weatherIcon = this.setWeatherIcon(element.weather[0].icon);

      const tempInCelcius = Math.floor(element.main.temp - 273.15);
      const formattedDate = format(parseISO(element.dt_txt), 'yyyy-MM-dd');
      const selectedDayInfo = format(parseISO(element.dt_txt), 'eeee do MMMM');
  
      const weatherObj = {
        dayName: dayName,
        dayTime: dayTime,
        weatherIcon: weatherIcon,
        tempInCelcius: parseInt(tempInCelcius.toString())
      }
      element.weatherObj = weatherObj;
      element.formattedDate = formattedDate;
      element.selectedDayInfo = selectedDayInfo;
    }
    this.findWeeklyWeatherForecast();

  }

  findWeeklyWeatherForecast() {
    let today = new Date();
    let weekDates = [];
    this.weeklyWeatherForecast = [];

    for(let i=0; i<6; i++){
      let date = new Date();
      date.setDate(today.getDate() + i);
      let formattedDate =  format(date, 'yyyy-MM-dd');
      console.log(date);
      console.log(formattedDate);
      weekDates.push(formattedDate); 
    }

    let dateIndex = 0;
    for(let element of this.weatherForecast.list){
      if(element.formattedDate == weekDates[dateIndex]){

        this.weeklyWeatherForecast.push(element);
        if(dateIndex == 5){
          break;
        }else{
          dateIndex++;
        }
      }
      
    }
    console.log(this.weeklyWeatherForecast);
    this.findSelectedDayWeatherForecast(weekDates[0],'Today');
  }

  findSelectedDayWeatherForecast(selectedDay: string, selectedDayInfo: string) {
    if(selectedDay == format(new Date(), 'yyyy-MM-dd')){
      this.selectedDayInfo = 'Today';
    }else{
      this.selectedDayInfo =  selectedDayInfo;
    }
    console.log('selectedDayInfo: ',selectedDayInfo);
    
    this.selectedWeatherDay = selectedDay;
    this.selectedDayWeatherForecast = [];
    for (let index = 0; index < this.weatherForecast.list.length; index++) {
      if(this.weatherForecast.list[index].formattedDate == selectedDay){
        this.selectedDayWeatherForecast.push(this.weatherForecast.list[index]);
      }
    }
    console.log(this.selectedDayWeatherForecast);
  }

  setWeatherIcon(weatherIcon:string):string{
    if(weatherIcon === '01d' ){
      return 'SunIcon';
    }else if(weatherIcon === '01n'){
      return 'NightIcon';
    }else if(weatherIcon === '02d'){
      return 'CloudySunIcon';
    }else if(weatherIcon === '02n'){
      return 'CloudyNightIcon';
    }else if(weatherIcon === '03d' || weatherIcon === '03n' || weatherIcon === '04d' || weatherIcon === '04n'){
      return 'CloudyIcon';
    }else if(weatherIcon === '09d' || weatherIcon === '09n'){
      return 'ShowersIcon';
    }else if(weatherIcon === '10d' || weatherIcon === '10n'){
      return 'LightRainIcon';
    }else if(weatherIcon === '11d' || weatherIcon === '11n'){
      return 'ThunderIcon';
    }else if(weatherIcon === '13d' || weatherIcon === '13n'){
      return 'FrostIcon';
    }else if(weatherIcon === '50d' || weatherIcon === '50n'){
      return '50d';
    }else{
      return '';
    }
    // else if(weatherIcon === '50d' || weatherIcon === '50n'){
    // }


  }

  goBack() {
    this.location.back();
  }

  closeNewModel() {
    this.showWeather = false;
  }

  showWeatherFunc() {
    this.showWeather = true;
  }

}
