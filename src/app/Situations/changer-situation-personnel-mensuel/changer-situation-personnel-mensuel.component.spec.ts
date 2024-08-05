import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerSituationPersonnelMensuelComponent } from './changer-situation-personnel-mensuel.component';

describe('ChangerSituationPersonnelMensuelComponent', () => {
  let component: ChangerSituationPersonnelMensuelComponent;
  let fixture: ComponentFixture<ChangerSituationPersonnelMensuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangerSituationPersonnelMensuelComponent]
    });
    fixture = TestBed.createComponent(ChangerSituationPersonnelMensuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
