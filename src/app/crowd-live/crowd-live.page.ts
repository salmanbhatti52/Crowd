import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-crowd-live',
  templateUrl: './crowd-live.page.html',
  styleUrls: ['./crowd-live.page.scss'],
})
export class CrowdLivePage implements OnInit {

  constructor(public location:Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }
}
