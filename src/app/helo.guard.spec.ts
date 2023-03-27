import { TestBed } from '@angular/core/testing';

import { HeloGuard } from './helo.guard';

describe('HeloGuard', () => {
  let guard: HeloGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HeloGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
