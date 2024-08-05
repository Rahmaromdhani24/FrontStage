import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvEchelonComponent } from './av-echelon.component';

describe('AvEchelonComponent', () => {
  let component: AvEchelonComponent;
  let fixture: ComponentFixture<AvEchelonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvEchelonComponent]
    });
    fixture = TestBed.createComponent(AvEchelonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
