import { TestBed } from '@angular/core/testing';

import { NavbarAnimationService } from './navbar-animation.service';

describe('NavbarAnimationService', () => {
  let service: NavbarAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
