import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {FormControl, Validators, NgModel} from '@angular/forms';
import {AngularFireDatabase} from 'angularfire2/database';
import { ToastrService } from 'ngx-toastr';
// import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
// import * as email from 'nativescript-email';
// import {compose} from 'nativescript-email';
import { Http } from '@angular/http'
import { HttpHeaders} from '@angular/common/http'

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
  fromControl = new FormControl('', [Validators.required]);
  toControl = new FormControl('Wisma Asia', [Validators.required]);
  constructor(private db: AngularFireDatabase, private toastrService: ToastrService, private http: Http) { 
    // this.toastr.setRootViewContainerRef(vcr);
    // this.options = this.toastrService.toastrConfig;
  }

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate()+14);
  shuttlePoints = SHUTTLE_POINTS;
  defaultOption = new FormControl(this.shuttlePoints[2]);
  from = '';
  to = 'BCA Learning Institute';

  // fromModel = new NgModel();
  dateValue = this.date.value;
  update(dateInput: string){
    this.dateValue = dateInput
  }
  pushBooking(): void{
    // console.log(this.dateValue.getDate());
    var bookingObj = {from: this.from,
                  to: this.to,
                  date: this.dateValue.getDate() + '-' + this.dateValue.getMonth() + '-' + this.dateValue.getFullYear()}
    // this.db.list('/booking').push(bookingObj);
    this.http.post('/push-booking', bookingObj).subscribe(data => {
      console.log('tesssss'+data);
    });
    // this.sendEmail(bookingObj);
    this.toastrService.success('Submitted succesfully, check your email', 'Add Booking');
    this.resetForm();
  }

  resetForm(): void{
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
    this.pointsObservable = this.db.list('/shuttle-points').valueChanges();
    let i = 0;
    let today = new Date();
    let day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    while (i < 10) {
      if(today.getDay() != 0 || today.getDay() != 6)
        this.dates[i] = day[today.getDay()] + ', ' + today.getDate() + '-' + today.getMonth() + '-' + today.getFullYear();
        i+=1;
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
    }
  }

}
