import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowTicketsPage } from './show-tickets.page';

describe('ShowTicketsPage', () => {
  let component: ShowTicketsPage;
  let fixture: ComponentFixture<ShowTicketsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowTicketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
