import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgModel } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
// import * as email from 'nativescript-email';
// import {compose} from 'nativescript-email';
import { Http } from '@angular/http'
import { HttpHeaders } from '@angular/common/http'

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
  selector: 'app-add-booking-admin',
  templateUrl: './add-booking-admin.component.html',
  styleUrls: ['./add-booking-admin.component.scss']
})

export class AddBookingAdminComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  fromControl = new FormControl('', [Validators.required]);
  toControl = new FormControl('Wisma Asia', [Validators.required]);
  constructor(
    private db: AngularFireDatabase,
    private toastrService: ToastrService,
    private http: Http,
    private fb: FormBuilder
  ) { }

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate() + 14);
  shuttlePoints = SHUTTLE_POINTS;
  defaultOption = new FormControl(this.shuttlePoints[2]);
  from = '';
  to = 'BCA Learning Institute';
  private processing = false;

  // fromModel = new NgModel();
  dateValue = this.date.value;
  update(dateInput: string) {
    this.dateValue = dateInput
  }
  pushBooking(): void {
    // console.log(this.dateValue.getDate());
    this.processing = true;
    var bookingObj = {
      type: this.form.value.type,
      name: this.form.value.name,
      nip: this.form.value.nip,
      program: this.form.value.program,
      phoneNo: this.form.value.phone,
      email: this.form.value.email,
      from: this.form.value.from.split('+')[0],
      to: this.to,
      date: this.dateValue.getDate() + '-' + (this.dateValue.getMonth() + 1) + '-' + this.dateValue.getFullYear(),
      departure: this.form.value.from.split('+')[1]
    }
    // date: this.dateValue}

    // this.db.list('/booking').push(bookingObj);
    this.http.post('/push-booking-admin', bookingObj).subscribe(data => {
      this.processing = false;
      this.toastrService.success('Submitted succesfully, check your email', 'Add Booking');
      this.resetForm();    
    }, error => {
      this.toastrService.error('Lost Connection!');
      this.processing = false;
    });
    this.formSubmitAttempt = true;
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
    this.form = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      nip: ['', Validators.required],
      program: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      from: ['', Validators.required],
      to: ['BCA Learning Institute'],
      date: ['', Validators.required],
    });
    this.pointsObservable = this.db.list('/shuttle-points').valueChanges();
    let i = 0;
    let today = new Date();
    let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    while (i < 10) {
      if (today.getDay() != 0 || today.getDay() != 6)
        this.dates[i] = day[today.getDay()] + ', ' + today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
      i += 1;
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    }
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
}
