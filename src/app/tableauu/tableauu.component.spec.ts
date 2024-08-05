import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauuComponent } from './tableauu.component';

describe('TableauuComponent', () => {
  let component: TableauuComponent;
  let fixture: ComponentFixture<TableauuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableauuComponent]
    });
    fixture = TestBed.createComponent(TableauuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
