import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-intellectual-properties',
  templateUrl: './intellectual-properties.page.html',
  styleUrls: ['./intellectual-properties.page.scss'],
})
export class IntellectualPropertiesPage implements OnInit {

  constructor(public location:Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }

}
