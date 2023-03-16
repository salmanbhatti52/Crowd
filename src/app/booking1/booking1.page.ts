import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

import * as moment from "moment";

@Component({
  selector: "app-booking1",
  templateUrl: "./booking1.page.html",
  styleUrls: ["./booking1.page.scss"],
})
export class Booking1Page implements OnInit {
  config = {
    show: false,
    weekOffset: -2,
    selectedDate: new Date(),
    DisablePastDays: true,
  };

  userdata: any = "";
  visitorArr: any = "";
  people = 2;
  peopleShow = false;

  datesArr: any = "";
  selectedIndexDate = -1;

  peopleArr = [
    {
      id: 1,
      people: 1,
      name: "people",
    },
    {
      id: 2,
      people: 2,
      name: "people",
    },
    {
      id: 3,
      people: 3,
      name: "people",
    },
    {
      id: 4,
      people: 4,
      name: "people",
    },
    {
      id: 5,
      people: 5,
      name: "people",
    },
    {
      id: 6,
      people: 6,
      name: "people",
    },
    {
      id: 7,
      people: 7,
      name: "people",
    },
    {
      id: 8,
      people: 8,
      name: "people",
    },
  ];

  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService
  ) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.datesArr = this.getDate();
  }

  getDate() {
    var arr = new Array();
    var dt = new Date();
    var ed = new Date("2024-10-01");
    while (dt <= ed) {
      arr.push(new Date(dt).toString()); //save only the Day MMM DD YYYY part
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  handleImgError2(ev: any, item: any) {
    console.log("hloooooo");

    const source = ev.srcElement;
    const imgSrc = `assets/imgs/inplace.jpeg`;
    source.src = imgSrc;
  }

  onDateChange(date: any) {
    console.log(date);
  }

  showCalendar() {
    this.config.show = true;
  }

  getDay1(val: any) {
    return moment(val).format("ddd");
  }
  getDay2(val: any) {
    return moment(val).format("DD");
  }
  getDay3(val: any) {
    return moment(val).format("MMM");
  }
  getDay4(val: any) {
    return moment(val).format("YYYY");
  }

  dateSelected(val: any) {
    this.selectedIndexDate = val;
  }

  bookTable() {
    this.router.navigate(['booking2'])
  }

  peopleClick(a: any) {
    this.peopleShow = false;
    console.log(a);
    this.people = a.people;
  }

  hideShowPeople() {
    if (this.peopleShow) {
      this.peopleShow = false;
    } else {
      this.peopleShow = true;
    }
  }
}
