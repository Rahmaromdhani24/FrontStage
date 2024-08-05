import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancementPersonnelHoraireComponent } from './avancement-personnel-horaire.component';

describe('AvancementPersonnelHoraireComponent', () => {
  let component: AvancementPersonnelHoraireComponent;
  let fixture: ComponentFixture<AvancementPersonnelHoraireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancementPersonnelHoraireComponent]
    });
    fixture = TestBed.createComponent(AvancementPersonnelHoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
