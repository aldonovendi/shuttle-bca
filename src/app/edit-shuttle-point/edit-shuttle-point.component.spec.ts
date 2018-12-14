import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShuttlePointComponent } from './edit-shuttle-point.component';

describe('EditShuttlePointComponent', () => {
  let component: EditShuttlePointComponent;
  let fixture: ComponentFixture<EditShuttlePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShuttlePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShuttlePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
