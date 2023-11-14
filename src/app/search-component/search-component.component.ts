import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.component.html',
  styleUrls: ['./search-component.component.scss'],
})
export class SearchComponentComponent  implements OnInit {
  @ViewChild('searchbar')
  searchbar!: IonSearchbar;
  venues:any = []
  name: string | undefined;
  public data = [
    'Amsterdam',
    'Buenos Aires',
    'Cairo',
    'Geneva',
    'Hong Kong',
    'Istanbul',
    'London',
    'Madrid',
    'New York',
    'Panama City',
  ];
  public results = [...this.venues];
  
  
  constructor(private modalCtrl: ModalController,
    public rest:RestService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.venues = this.rest.venuArrHome;
    this.results = [...this.venues];
    console.log('This is modal ionViewWillEnter()');
    
    
  }

  handleInput(event:any) {
    if (event.detail.value === '') {
      this.modalCtrl.dismiss();
    }else{
      const query = event.target.value.toLowerCase();
      this.results = this.venues.filter((d:any) => d.name.toLowerCase().indexOf(query) > -1);
      console.log(this.results);
    }
    
    
  }

  selectVenue(result:any){
    console.log(result);
    return this.modalCtrl.dismiss(result, 'confirm');
  }

  ionViewDidEnter() {
    this.searchbar.setFocus();
  }
  

  cancel() {
    console.log('dismiss called');
    return this.modalCtrl.dismiss(null, 'cancel');
  }


}
