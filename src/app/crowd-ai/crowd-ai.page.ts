import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-crowd-ai',
  templateUrl: './crowd-ai.page.html',
  styleUrls: ['./crowd-ai.page.scss'],
})
export class CrowdAiPage implements OnInit {

  constructor(public location:Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }
}
