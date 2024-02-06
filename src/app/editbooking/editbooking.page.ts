import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { RestService } from "../rest.service";
import {format, parseISO,addDays,isDate, getDate,getMonth,getYear, formatISO, getDaysInMonth, eachDayOfInterval} from 'date-fns';
// import * as moment from "moment";

import { DatePicker } from "@ionic-native/date-picker/ngx";
import { IonDatetime, ModalController } from "@ionic/angular";
import { CalendarPage } from "../calendar/calendar.page";

@Component({
  selector: "app-editbooking",
  templateUrl: "./editbooking.page.html",
  styleUrls: ["./editbooking.page.scss"],
})
export class EditbookingPage implements OnInit {
  @ViewChild('datetime') dateTime!:IonDatetime;
  minDate = format(parseISO(new Date().toISOString()),'yyyy-MM-dd');
  selectedMonthAndYear = format(new Date(),'MMM yyyy');
  todayDayNumber = parseInt(format(new Date(),'d'));
  selectedDayNumber = this.todayDayNumber;
  currentMonthNumber = getMonth(new Date());
  selectedMonthNumber = this.currentMonthNumber;
  currentYearNumber = getYear(new Date());
  selectedYearNumber = this.currentYearNumber;
  remainingDaysCountInMonth = getDaysInMonth(new Date())- this.todayDayNumber + 1;
 
  daysInMonth:number[] = [];
  dayNamesInMonth:any[] = [];
  daysNamesAndNumbers:any[] = [];

  setMonthNumberStatus:boolean = false;

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

  myDate: any = "";

  usertime: any = format(parseISO(new Date().toISOString()),'HH:mm');

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
  dateIsoStirng: any;

  constructor(
    public location: Location,
    public router: Router,
    public rest: RestService,
    public datePicker: DatePicker,
    public modalCtrlr:ModalController
  ) {

    // this.setCurrentDaysInMonth();
    this.loadPageData();
    console.log("this.minDate",this.minDate);
    console.log("this.userTime",this.usertime);
    
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  loadPageData() {
    // this.datesArr = this.getDate();
    this.selectedVenue = this.rest.detail;
    this.selectedBooking = this.rest.selectedBooking;
    console.log(this.selectedBooking);
    this.userdata = localStorage.getItem("userdata");
    this.userID = JSON.parse(this.userdata).users_customers_id;

    this.dateIsoStirng = this.selectedBooking.bookings_date;
    console.log("this.dateIsoStirng", this.dateIsoStirng);

    // this.selectedMonthAndYear = format(new Date(this.dateIsoStirng),'MMM yyyy');
     this.setBookingSelectedDate();
         
    // this.mtime = format(parseISO(this.selectedBooking.bookings_time), "HH:mm");
    this.usertime = this.selectedBooking.bookings_time;

    this.people = this.selectedBooking.no_of_diners;

    console.log("this.usertime------", this.usertime);
  }

  setCurrentDaysInMonth(selectedDayNumber:any) {
    this.selectedMonthNumber = getMonth(new Date());
    this.currentMonthNumber = this.selectedMonthNumber;
    this.selectedYearNumber = getYear(new Date());
    if(selectedDayNumber == null){
      this.selectedDayNumber = this.todayDayNumber;
    }else{
      this.selectedDayNumber = selectedDayNumber;
    }
    
    // =================setting day numbers in month from today to last date of month=====================
    this.daysInMonth = [];
    for (let index = 0; index < this.remainingDaysCountInMonth; index++) {

      this.daysInMonth.push(this.todayDayNumber + index);
      
    }
    console.log("this.daysInMonth",this.daysInMonth);
    

  // =================setting day names in month from today to last date of month=====================
    let year = getYear(new Date());
    let month = getMonth(new Date());
    let days = getDaysInMonth(new Date());
    this.dayNamesInMonth =  eachDayOfInterval({
      start: new Date(year, month, this.todayDayNumber),
      end: new Date(year, month, days)
    });
    console.log("this.dayNamesInMonth",this.dayNamesInMonth);
    

    //==================setting short day format for day names in month=====================
    for (let index = 0; index < this.dayNamesInMonth.length; index++) {
      this.dayNamesInMonth[index] = format(this.dayNamesInMonth[index],'eee');
      
    }

    // =================combining days and names=====================
    this.daysNamesAndNumbers = this.daysInMonth.map((day, index) => {
        return {
          number: day,
          name: this.dayNamesInMonth[index],
        };
    });
    console.log("this.daysNamesAndNumbers",this.daysNamesAndNumbers);
    
  }

  selectDay(dayNumber:any){
    this.selectedDayNumber = dayNumber;
  }

  async setBookingSelectedDate() {
    this.selectedDayNumber = parseInt(format(new Date(this.dateIsoStirng),'d'));
    console.log("this.selectedDayNumber user selected", this.selectedDayNumber);
    this.selectedMonthNumber = getMonth(new Date(this.dateIsoStirng));
    console.log("this.selectedMonthNumber user selected", this.selectedMonthNumber);
    this.selectedYearNumber = getYear(new Date(this.dateIsoStirng));
    console.log("this.selectedYearNumber user selected", this.selectedYearNumber);
    
    let selectedMonthNumber = this.selectedMonthNumber;
    let currentMonthNumber = getMonth(new Date());
    let selectedYearNumber = this.selectedYearNumber; 
    let currentYearNumber = getYear(new Date());

    if(selectedMonthNumber ==  currentMonthNumber && selectedYearNumber == currentYearNumber ){
      console.log('entered');
      this.selectedMonthAndYear = format(new Date(this.dateIsoStirng),'MMM yyyy');
      this.setCurrentDaysInMonth(this.selectedDayNumber);
      
    }else{
      this.selectedMonthAndYear = format(new Date(this.dateIsoStirng),'MMM yyyy');
      this.setDaysInMonth(this.dateIsoStirng);
    }


  }

  // ====================================custom calendar code start here===========================================

  async selectDate() {
    let selectedMonthNumber = this.selectedMonthNumber;
    selectedMonthNumber++;
    
    let selectedDate = this.selectedYearNumber + "-" + selectedMonthNumber;

    // =============setting date format in minimum 2 digit form for day and Month i.e 2024-01-03 means (3 january, 2024)=============================
      
      const [year, month] = selectedDate.split('-');

      selectedDate = `${year}-${month.padStart(2, '0')}`;

      console.log("selectedDateFormatted",selectedDate);
    // ========================done=========================
      const modal = await this.modalCtrlr.create({
        component: CalendarPage,
        cssClass: "calendar_popup",
        componentProps: {
          selectedDate:selectedDate
        }
      });

    await modal.present();

    const {data,role} = await modal.onWillDismiss();
    if(role == 'confirm'){
      console.log("data",data);

      let selectedMonthNumber = getMonth(new Date(data));
      let currentMonthNumber = getMonth(new Date());
      let selectedYearNumber = getYear(new Date(data));
      let currentYearNumber = getYear(new Date());

      if(selectedMonthNumber ==  currentMonthNumber && selectedYearNumber == currentYearNumber ){
        console.log('entered');
        this.selectedMonthAndYear = format(new Date(data),'MMM yyyy');
        this.setCurrentDaysInMonth(null);
        
      }else{
        
        this.selectedMonthAndYear = format(new Date(data),'MMM yyyy');
        this.setDaysInMonth(data);
      }
    }else if(role == 'cancel'){
      
    }else{

    }


  }


  setDaysInMonth(date:any) {
    this.selectedMonthNumber = getMonth(new Date(date));
    this.currentMonthNumber = this.selectedMonthNumber;
    this.selectedYearNumber = getYear(new Date(date));
    this.selectedDayNumber = parseInt(format(new Date(date),'d'));
    // this.selectedDayNumber = 1;
    // =================setting day numbers in month of selected month=====================
    let daysCountInMonth = getDaysInMonth(new Date(date));
    console.log(daysCountInMonth);
    this.daysInMonth = [];
    for (let index = 1; index <= daysCountInMonth; index++) {
      this.daysInMonth.push(index);
      
    }
    console.log(this.daysInMonth);
    

  // =================setting day names in month from today to last date of month=====================
    let year = getYear(new Date(date));
    let month = getMonth(new Date(date));
    let days = getDaysInMonth(new Date(date));
    this.dayNamesInMonth =  eachDayOfInterval({
      start: new Date(year, month, 1),
      end: new Date(year, month, days)
    });

    console.log(this.dayNamesInMonth);
    

    //==================setting short day format for day names in month=====================
    for (let index = 0; index < this.dayNamesInMonth.length; index++) {
      this.dayNamesInMonth[index] = format(this.dayNamesInMonth[index],'eee');
      
    }

    // =================combining days and names=====================
    this.daysNamesAndNumbers = this.daysInMonth.map((day, index) => {
        return {
          number: day,
          name: this.dayNamesInMonth[index],
        };
    });

    console.log(this.daysNamesAndNumbers);
    
  }





  // ======================================custom calendar code end here===========================================

  // getDate() {
  //   var arr = new Array();
  //   var dt = new Date();
  //   var ed = new Date("2024-10-01");
  //   while (dt <= ed) {
  //     arr.push(new Date(dt).toString()); //save only the Day MMM DD YYYY part
  //     dt.setDate(dt.getDate() + 1);
  //   }
  //   return arr;
  // }

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

  // getDay1(val: any) {
  //   return moment(val).format("ddd");
  // }
  // getDay2(val: any) {
  //   return moment(val).format("DD");
  // }
  // getDay3(val: any) {
  //   return moment(val).format("MMM");
  // }
  // getDay4(val: any) {
  //   return moment(val).format("YYYY");
  // }

  // dateFormate(val: any) {
  //   return moment(val).format("MMMM YYYY");
  // }

  dateSelected(val: any) {
    this.selectedIndexDate = val;
  }

  bookTable() {
    let selectedMonthNumber = this.selectedMonthNumber;
    
    this.myDate = this.selectedYearNumber + "-" + selectedMonthNumber + "-" + this.selectedDayNumber;
    
    if (this.myDate == "") {
      this.rest.presentToast("Please select date");
    } else if (this.usertime == "") {
      this.rest.presentToast("Please select time");
    } else {
      if(this.setMonthNumberStatus == false){
        selectedMonthNumber++;
        this.setMonthNumberStatus = true;
      }
      this.myDate = this.selectedYearNumber + "-" + selectedMonthNumber.toString().padStart(2, '0') + "-" + this.selectedDayNumber.toString().padStart(2,'0');

      console.log('Going to hit API');
      
      console.log(this.myDate);

      var ss = JSON.stringify({
        venues_bookings_id: this.selectedBooking.venues_bookings_id,
        no_of_diners: this.people,
        bookings_date: this.myDate,
        bookings_time: this.usertime,
      });

      console.log(ss);
      this.rest.presentLoader();
      this.rest.bookings_edit(ss).subscribe((res: any) => {
        this.rest.dismissLoader();
        console.log(res);

        if (res.status == "success") {
          this.rest.selectedBooking = res.data;
          this.rest.selectedBooking.coming_from = 'other';
          this.location.back();
        } else {
          this.rest.presentToast("Error");
        }
      },(err:any)=>{
        this.rest.dismissLoader();
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

  // showDatepicker1() {
  //   this.datePicker
  //     .show({
  //       date: new Date(),
  //       mode: "date",
  //       androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
  //       okText: "Save Date",
  //       // todayText: "Set Today",
  //     })
  //     .then(
  //       (date) => {
  //         this.myDate = moment(date).format("YYYY-MM-DD");

  //         console.log("date----", date);
  //         console.log("date----", this.myDate);
  //       },
  //       (err) => console.log("Error occurred while getting date: ", err)
  //     );
  // }

  formattedString(ev:any){

    this.myDate = format(parseISO(ev.detail.value), 'yyyy-MM-dd');
    console.log('DateValues: ',ev.detail.value);
    console.log(this.myDate);
  }
}
