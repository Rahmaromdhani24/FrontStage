import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasConnecteComponent } from './pas-connecte.component';

describe('PasConnecteComponent', () => {
  let component: PasConnecteComponent;
  let fixture: ComponentFixture<PasConnecteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasConnecteComponent]
    });
    fixture = TestBed.createComponent(PasConnecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
