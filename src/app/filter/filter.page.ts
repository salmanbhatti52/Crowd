import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { CalendarComponentOptions } from "ion2-calendar";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.page.html",
  styleUrls: ["./filter.page.scss"],
})
export class FilterPage implements OnInit {
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

  optionsRange: CalendarComponentOptions = {
    pickMode: "range",
  };

  date: string = "";
  type = "string"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'

  constructor(public modalCtrl: ModalController, public router: Router) {}

  usercity = "Select City";

  ngOnInit() {}

  closeModel() {
    this.modalCtrl.dismiss();
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
    this.userCategory = a.catname;
  }
}
