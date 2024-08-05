import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerSituationParMleComponent } from './changer-situation-par-mle.component';

describe('ChangerSituationParMleComponent', () => {
  let component: ChangerSituationParMleComponent;
  let fixture: ComponentFixture<ChangerSituationParMleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangerSituationParMleComponent]
    });
    fixture = TestBed.createComponent(ChangerSituationParMleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
