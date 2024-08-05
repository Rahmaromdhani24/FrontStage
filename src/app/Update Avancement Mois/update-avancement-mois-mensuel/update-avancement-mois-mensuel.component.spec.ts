import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAvancementMoisMensuelComponent } from './update-avancement-mois-mensuel.component';

describe('UpdateAvancementMoisMensuelComponent', () => {
  let component: UpdateAvancementMoisMensuelComponent;
  let fixture: ComponentFixture<UpdateAvancementMoisMensuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateAvancementMoisMensuelComponent]
    });
    fixture = TestBed.createComponent(UpdateAvancementMoisMensuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
