import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";

import * as moment from "moment";

import { DatePicker } from "@ionic-native/date-picker/ngx";

@Component({
  selector: "app-editbooking",
  templateUrl: "./editbooking.page.html",
  styleUrls: ["./editbooking.page.scss"],
})
export class EditbookingPage implements OnInit {
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

  myDate: any = "Select Date";

  usertime: any = "";

  selectedBooking: any = "";

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

  selectedVenue: any = "";
  userID: any = "";
  mtime: string = "";

  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public datePicker: DatePicker
  ) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  ionViewWillEnter() {
    this.datesArr = this.getDate();
    this.selectedVenue = this.rest.detail;
    this.selectedBooking = this.rest.selectedBooking;
    console.log(this.selectedBooking);
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.myDate = this.selectedBooking.bookings_date;
    this.mtime = moment(this.selectedBooking.bookings_time).format("hh:mm");
    this.usertime = this.selectedBooking.bookings_time;

    this.people = this.selectedBooking.no_of_diners;

    console.log("this.usertime------", this.usertime);
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

  dateFormate(val: any) {
    return moment(val).format("MMMM YYYY");
  }

  dateSelected(val: any) {
    this.selectedIndexDate = val;
  }

  bookTable() {
    if (this.myDate == "Select Date") {
      this.rest.presentToast("Please select date");
    } else if (this.usertime == "") {
      this.rest.presentToast("Please select time");
    } else {
      console.log("this.usertime------tttttttttttttt", this.usertime);

      // var tt = moment(this.usertime).format("h:mm");
      var ss = JSON.stringify({
        venues_bookings_id: this.selectedBooking.venues_bookings_id,
        no_of_diners: this.people,
        bookings_date: this.myDate,
        bookings_time: this.usertime,
      });

      console.log(ss);

      this.rest.bookings_edit(ss).subscribe((res: any) => {
        console.log(res);

        if (res.status == "success") {
          this.rest.selectedBooking = res.data;
          this.location.back();
        } else {
          this.rest.presentToast("Error");
        }
      });
    }
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

  showDatepicker1() {
    this.datePicker
      .show({
        date: new Date(),
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
        okText: "Save Date",
        // todayText: "Set Today",
      })
      .then(
        (date) => {
          this.myDate = moment(date).format("YYYY-MM-DD");

          console.log("date----", date);
          console.log("date----", this.myDate);
        },
        (err) => console.log("Error occurred while getting date: ", err)
      );
  }
}
