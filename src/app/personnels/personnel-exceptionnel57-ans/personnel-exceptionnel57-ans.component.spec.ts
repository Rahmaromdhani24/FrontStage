import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelExceptionnel57AnsComponent } from './personnel-exceptionnel57-ans.component';

describe('PersonnelExceptionnel57AnsComponent', () => {
  let component: PersonnelExceptionnel57AnsComponent;
  let fixture: ComponentFixture<PersonnelExceptionnel57AnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonnelExceptionnel57AnsComponent]
    });
    fixture = TestBed.createComponent(PersonnelExceptionnel57AnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
