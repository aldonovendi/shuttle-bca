import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePhoneNoComponent } from './change-phone-no.component';

describe('ChangePhoneNoComponent', () => {
  let component: ChangePhoneNoComponent;
  let fixture: ComponentFixture<ChangePhoneNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePhoneNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePhoneNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
