import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherDetailPage } from './weather-detail.page';

describe('WeatherDetailPage', () => {
  let component: WeatherDetailPage;
  let fixture: ComponentFixture<WeatherDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WeatherDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
