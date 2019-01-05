import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
// import * as email from 'nativescript-email';
// import {compose} from 'nativescript-email';
import { Http } from '@angular/http';
import { HttpHeaders } from '@angular/common/http'
import { mixinDisabled } from '@angular/material';
export const SHUTTLE_POINTS: String[] = [
  "Wisma Asia",
  "Kelapa Gading",
  "BCA Learning Institute",
  "Bogor",
  "Bekasi",
  "Alam Sutera",
  "Pondok Indah",
]

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})

export class AddBookingComponent implements OnInit {
  form: FormGroup;
  // fromControl = new FormControl('', [Validators.required]);
  toControl = new FormControl('Wisma Asia', [Validators.required]);
  constructor(
    private db: AngularFireDatabase,
    private toastrService: ToastrService,
    private http: Http,
    private fb: FormBuilder,
  ) {
    // this.toastr.setRootViewContainerRef(vcr);
    // this.options = this.toastrService.toastrConfig;
  }

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  todayDate = new Date();
  minDate;
  maxDate;
  shuttlePoints = SHUTTLE_POINTS;
  defaultOption = new FormControl(this.shuttlePoints[2]);
  from = '';
  to = 'BCA Learning Institute';
  processing = false;
  // fromModel = new NgModel();
  dateValue = this.date.value;
  update(dateInput: string) {
    this.dateValue = dateInput
  }
  pushBooking(): void {
    // console.log(this.dateValue.getDate());
    this.processing = true;

    var bookingObj = {
      from: this.form.value.from.split('+')[0],
      to: this.form.value.to,
      date: this.form.value.date.getDate() + '-' + (this.form.value.date.getMonth() + 1) + '-' + this.form.value.date.getFullYear(),
      departure: this.form.value.from.split('+')[1]
    }
    // date: this.dateValue}

    // this.db.list('/booking').push(bookingObj);
    this.http.post('/push-booking', bookingObj).subscribe(data => {
      console.log('tesssss' + data);
      this.toastrService.success('Submitted succesfully, check your email', 'Add Booking');
      this.resetForm();
      this.processing = false;
    }, error => {
      if(error.status = 500){
        this.toastrService.error('Cancel your previous booking first','Booking already exist on this date');
      } else{
        this.toastrService.error('Lost Connection!');
      }
      this.processing = false;
    });
    // this.sendEmail(bookingObj);
    
    
  }

  resetForm(): void {
    // this.from = '';
    this.dateValue = this.date.value;
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }


  // sendEmail(){

  //   email.available().then(available => {
  //     console.log("The device email status is ${available}");
  //     if(available){
  //       email.compose({
  //         to: ['aldonovendi@gmail.com'],
  //         subject: 'testt',
  //         body: 'testest'
  //       }).then(result => {
  //         console.log(result);
  //       }).catch(error => console.error(error));
  //     }
  // }).catch(error => console.error(error));
  // }
  dates: any[] = [];
  pointsObservable: Observable<any[]>;
  ngOnInit() {
    if(this.todayDate.getDay() == 0){
      this.minDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate() + 8 - this.todayDate.getDay());
    } else {
      this.minDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate() + 15 - this.todayDate.getDay());
    }
    this.maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate() + 5);    
    
    this.form = this.fb.group({
      from: ['', Validators.required],
      to: ['BCA Learning Institute'],
      date: ['', Validators.required],
    });
    // if(this.minDate.getDay()!=0){
    //   this.minDate.setDate(this.minDate.getDate() - this.minDate.getDay() + 15);
    //   this.maxDate.setDate(this.minDate.getDate() + 5);
    // };
    // this.form.controls['date'].disable();
    this.pointsObservable = this.db.list('/shuttle-points').valueChanges();
    // let i = 0;
    // let today = new Date();
    // let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    // while (i < 10) {
    //   if (today.getDay() != 0 || today.getDay() != 6)
    //     this.dates[i] = day[today.getDay()] + ', ' + today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
    //   i += 1;
    //   today = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    // }
  }

}
