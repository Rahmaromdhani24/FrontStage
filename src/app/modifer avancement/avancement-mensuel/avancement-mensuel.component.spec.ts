import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancementMensuelComponent } from './avancement-mensuel.component';

describe('AvancementMensuelComponent', () => {
  let component: AvancementMensuelComponent;
  let fixture: ComponentFixture<AvancementMensuelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvancementMensuelComponent]
    });
    fixture = TestBed.createComponent(AvancementMensuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
