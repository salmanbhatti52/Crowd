import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportEnquiriesPage } from './support-enquiries.page';

describe('SupportEnquiriesPage', () => {
  let component: SupportEnquiriesPage;
  let fixture: ComponentFixture<SupportEnquiriesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SupportEnquiriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
