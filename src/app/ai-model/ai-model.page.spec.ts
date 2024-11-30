import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiModelPage } from './ai-model.page';

describe('AiModelPage', () => {
  let component: AiModelPage;
  let fixture: ComponentFixture<AiModelPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AiModelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
