import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvEchComponent } from './av-ech.component';

describe('AvEchComponent', () => {
  let component: AvEchComponent;
  let fixture: ComponentFixture<AvEchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvEchComponent]
    });
    fixture = TestBed.createComponent(AvEchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
