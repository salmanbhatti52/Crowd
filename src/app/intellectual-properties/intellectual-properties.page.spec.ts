import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntellectualPropertiesPage } from './intellectual-properties.page';

describe('IntellectualPropertiesPage', () => {
  let component: IntellectualPropertiesPage;
  let fixture: ComponentFixture<IntellectualPropertiesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IntellectualPropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
