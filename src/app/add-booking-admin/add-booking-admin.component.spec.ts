import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookingAdminComponent } from './add-booking-admin.component';

describe('AddBookingAdminComponent', () => {
  let component: AddBookingAdminComponent;
  let fixture: ComponentFixture<AddBookingAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBookingAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBookingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
