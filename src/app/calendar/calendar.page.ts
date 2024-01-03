import { Component, Input, OnInit } from '@angular/core';
import {format, parseISO,addDays,isDate, getDate,getMonth,getYear, min} from 'date-fns';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  @Input() selectedDate: any;
  minDate = format(parseISO(new Date().toISOString()),'yyyy-MM-dd');
  userdate = this.minDate;
  constructor(public modalCtrlr: ModalController) { }

  ngOnInit() {
  }

  formattedString(dateVal:any){
    console.log("dateValue:",dateVal);
    
    if(dateVal!= ''){
      this.userdate = format(parseISO(dateVal), 'yyyy-MM-dd');
      console.log(this.userdate);
    }

  }

  closeModel(){
    this.modalCtrlr.dismiss(undefined,'cancel');
  }

  sendDateBack(){
    this.modalCtrlr.dismiss(this.userdate,'confirm');
  }

}
