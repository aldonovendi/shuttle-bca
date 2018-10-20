import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShuttlePointComponent } from './add-shuttle-point.component';

describe('AddShuttlePointComponent', () => {
  let component: AddShuttlePointComponent;
  let fixture: ComponentFixture<AddShuttlePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShuttlePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShuttlePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
