import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancementMoisMensuelComponent } from './avancement-mois-mensuel.component';

describe('AvancementMoisMensuelComponent', () => {
  let component: AvancementMoisMensuelComponent;
  let fixture: ComponentFixture<AvancementMoisMensuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancementMoisMensuelComponent]
    });
    fixture = TestBed.createComponent(AvancementMoisMensuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
