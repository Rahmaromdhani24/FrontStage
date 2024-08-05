import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelsHomeComponent } from './personnels-home.component';

describe('PersonnelsHomeComponent', () => {
  let component: PersonnelsHomeComponent;
  let fixture: ComponentFixture<PersonnelsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelsHomeComponent]
    });
    fixture = TestBed.createComponent(PersonnelsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
