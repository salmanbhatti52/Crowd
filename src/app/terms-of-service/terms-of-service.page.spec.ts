import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsOfServicePage } from './terms-of-service.page';

describe('TermsOfServicePage', () => {
  let component: TermsOfServicePage;
  let fixture: ComponentFixture<TermsOfServicePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TermsOfServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
