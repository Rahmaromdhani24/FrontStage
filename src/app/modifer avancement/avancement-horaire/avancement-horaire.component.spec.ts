import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancementHoraireComponent } from './avancement-horaire.component';

describe('AvancementHoraireComponent', () => {
  let component: AvancementHoraireComponent;
  let fixture: ComponentFixture<AvancementHoraireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancementHoraireComponent]
    });
    fixture = TestBed.createComponent(AvancementHoraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
