import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
// import { CalendarComponentOptions } from "ion2-calendar";
import {format, parseISO,addDays,isDate, getDate,getMonth,getYear} from 'date-fns';
@Component({
  selector: "app-filter",
  templateUrl: "./filter.page.html",
  styleUrls: ["./filter.page.scss"],
})
export class FilterPage implements OnInit {
  minDate = format(parseISO(new Date().toISOString()),'yyyy-MM-dd');
  myDate: any = format(parseISO(new Date().toISOString()),'yyyy-MM-dd');
  // userdate: any = "";
  cityArr = [
    {
      id: 1,
      usercity: "Multan",
    },
    {
      id: 2,
      usercity: "Mailsi",
    },
    {
      id: 3,
      usercity: "Muzafargarh",
    },
  ];

  catArr = [
    {
      id: 1,
      catname: "category 1",
    },
    {
      id: 1,
      catname: "category 2",
    },
    {
      id: 1,
      catname: "category 3",
    },
    {
      id: 1,
      catname: "category 4",
    },
    {
      id: 1,
      catname: "category 5",
    },
  ];

  usercityShow = false;
  userdateShow = false;
  userCatShow = false;

  userdate = "Date";
  userCategory = "Category";

  // optionsRange: CalendarComponentOptions = {
  //   pickMode: "range",
  // };

  date: string = "";
  type = "string"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  constructor(public modalCtrl: ModalController, public router: Router) {}

  usercity = "Select City";

  ngOnInit() {}

  closeModel() {
    this.modalCtrl.dismiss();
  }

  formattedString(dateVal:any){

    this.myDate = format(parseISO(dateVal), 'yyyy-MM-dd');
    console.log('DateValues: ',dateVal);
    console.log(this.myDate);
    
  }

  logout() {
    localStorage.clear();
    this.modalCtrl.dismiss();
    this.router.navigate(["login"]);
  }

  cityClick(a: any) {
    this.usercityShow = false;
    this.usercity = a.usercity;
  }

  hideShowusercity() {
    if (this.usercityShow) {
      this.usercityShow = false;
    } else {
      this.usercityShow = true;
    }
  }

  hideShowuserdate() {
    if (this.userdateShow) {
      this.userdateShow = false;
    } else {
      this.userdateShow = true;
    }
  }

  onChange(event: any) {
    console.log(event);
  }

  hideShowcat() {
    if (this.userCatShow) {
      this.userCatShow = false;
    } else {
      this.userCatShow = true;
    }
  }

  catClick(a: any) {
    this.userCatShow = false;
    this.userCategory = a.catname;
  }
}
