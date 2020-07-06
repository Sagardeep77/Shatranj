import { TestBed } from '@angular/core/testing';

import { GsapAnimationService } from './gsap-animation.service';

describe('GsapAnimationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GsapAnimationService = TestBed.get(GsapAnimationService);
    expect(service).toBeTruthy();
  });
});
