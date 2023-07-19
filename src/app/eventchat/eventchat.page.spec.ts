import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventchatPage } from './eventchat.page';

describe('EventchatPage', () => {
  let component: EventchatPage;
  let fixture: ComponentFixture<EventchatPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventchatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
