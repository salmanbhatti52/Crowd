import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestNearbySearchPage } from './test-nearby-search.page';

describe('TestNearbySearchPage', () => {
  let component: TestNearbySearchPage;
  let fixture: ComponentFixture<TestNearbySearchPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestNearbySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
