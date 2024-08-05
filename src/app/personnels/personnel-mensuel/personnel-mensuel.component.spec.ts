import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelMensuelComponent } from './personnel-mensuel.component';

describe('PersonnelMensuelComponent', () => {
  let component: PersonnelMensuelComponent;
  let fixture: ComponentFixture<PersonnelMensuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelMensuelComponent]
    });
    fixture = TestBed.createComponent(PersonnelMensuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
