import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriquesPersonnelComponent } from './historiques-personnel.component';

describe('HistoriquesPersonnelComponent', () => {
  let component: HistoriquesPersonnelComponent;
  let fixture: ComponentFixture<HistoriquesPersonnelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriquesPersonnelComponent]
    });
    fixture = TestBed.createComponent(HistoriquesPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
