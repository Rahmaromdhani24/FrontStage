import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvancementMoisHoraireComponent } from './update-avancement-mois-horaire.component';

describe('UpdateAvancementMoisHoraireComponent', () => {
  let component: UpdateAvancementMoisHoraireComponent;
  let fixture: ComponentFixture<UpdateAvancementMoisHoraireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAvancementMoisHoraireComponent]
    });
    fixture = TestBed.createComponent(UpdateAvancementMoisHoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
