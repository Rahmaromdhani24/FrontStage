import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HissComponent } from './hiss.component';

describe('HissComponent', () => {
  let component: HissComponent;
  let fixture: ComponentFixture<HissComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HissComponent]
    });
    fixture = TestBed.createComponent(HissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
