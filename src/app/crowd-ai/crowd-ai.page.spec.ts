import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrowdAiPage } from './crowd-ai.page';

describe('CrowdAiPage', () => {
  let component: CrowdAiPage;
  let fixture: ComponentFixture<CrowdAiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrowdAiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
