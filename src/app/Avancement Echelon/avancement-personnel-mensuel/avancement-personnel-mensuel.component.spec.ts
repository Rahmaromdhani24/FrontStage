import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancementPersonnelMensuelComponent } from './avancement-personnel-mensuel.component';

describe('AvancementPersonnelMensuelComponent', () => {
  let component: AvancementPersonnelMensuelComponent;
  let fixture: ComponentFixture<AvancementPersonnelMensuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancementPersonnelMensuelComponent]
    });
    fixture = TestBed.createComponent(AvancementPersonnelMensuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
