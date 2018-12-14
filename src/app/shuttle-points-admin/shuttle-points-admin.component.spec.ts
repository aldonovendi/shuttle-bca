import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttlePointsAdminComponent } from './shuttle-points-admin.component';

describe('ShuttlePointsAdminComponent', () => {
  let component: ShuttlePointsAdminComponent;
  let fixture: ComponentFixture<ShuttlePointsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShuttlePointsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttlePointsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
