import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeePathPage } from './see-path.page';

describe('SeePathPage', () => {
  let component: SeePathPage;
  let fixture: ComponentFixture<SeePathPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SeePathPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
