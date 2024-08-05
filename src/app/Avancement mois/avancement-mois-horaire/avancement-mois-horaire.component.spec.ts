import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancementMoisHoraireComponent } from './avancement-mois-horaire.component';

describe('AvancementMoisHoraireComponent', () => {
  let component: AvancementMoisHoraireComponent;
  let fixture: ComponentFixture<AvancementMoisHoraireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancementMoisHoraireComponent]
    });
    fixture = TestBed.createComponent(AvancementMoisHoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
