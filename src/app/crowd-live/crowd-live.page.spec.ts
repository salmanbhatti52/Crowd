import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrowdLivePage } from './crowd-live.page';

describe('CrowdLivePage', () => {
  let component: CrowdLivePage;
  let fixture: ComponentFixture<CrowdLivePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrowdLivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
