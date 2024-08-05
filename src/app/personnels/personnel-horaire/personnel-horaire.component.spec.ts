import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelHoraireComponent } from './personnel-horaire.component';

describe('PersonnelHoraireComponent', () => {
  let component: PersonnelHoraireComponent;
  let fixture: ComponentFixture<PersonnelHoraireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelHoraireComponent]
    });
    fixture = TestBed.createComponent(PersonnelHoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
