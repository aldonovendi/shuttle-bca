import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit {
  form: FormGroup;
  months: String[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years: String[] = ["2018"];
  constructor(
    private http: Http,
    private fb: FormBuilder,
  ) { }

  month = "";
  year = "";
  ngOnInit() {
    this.form = this.fb.group({
      month: ['', Validators.required],
      year: ['', Validators.required],
    });
  }

  getReport(){

  }
}
