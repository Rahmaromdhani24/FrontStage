import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauAvancementComponent } from './tableau-avancement.component';

describe('TableauAvancementComponent', () => {
  let component: TableauAvancementComponent;
  let fixture: ComponentFixture<TableauAvancementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableauAvancementComponent]
    });
    fixture = TestBed.createComponent(TableauAvancementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
