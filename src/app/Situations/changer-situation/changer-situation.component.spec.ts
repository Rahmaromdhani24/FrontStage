import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerSituationComponent } from './changer-situation.component';

describe('ChangerSituationComponent', () => {
  let component: ChangerSituationComponent;
  let fixture: ComponentFixture<ChangerSituationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangerSituationComponent]
    });
    fixture = TestBed.createComponent(ChangerSituationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
