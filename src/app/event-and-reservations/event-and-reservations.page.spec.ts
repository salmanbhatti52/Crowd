import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventAndReservationsPage } from './event-and-reservations.page';

describe('EventAndReservationsPage', () => {
  let component: EventAndReservationsPage;
  let fixture: ComponentFixture<EventAndReservationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventAndReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
