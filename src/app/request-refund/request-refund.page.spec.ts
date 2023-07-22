import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestRefundPage } from './request-refund.page';

describe('RequestRefundPage', () => {
  let component: RequestRefundPage;
  let fixture: ComponentFixture<RequestRefundPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RequestRefundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
