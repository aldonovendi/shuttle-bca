import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../services/excel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.scss']
})

export class DownloadReportComponent implements OnInit {
  form: FormGroup;
  months: String[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years: String[] = ["2018"];

  private filterData = {
    type: '',
    assemblyPoint: '',
    month: '',
    year: ''
  }
  constructor(
    private http: Http,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private toastrService: ToastrService,
    private excelServ:ExcelService,
    private spinner: NgxSpinnerService
  ) { }
  pointsObservable: Observable<any[]>;
  month = "";
  year = "";
  assemblyPoint = "";
  type = "";
  private bookingList: any[];
  bookingListLength = 0;
  processing = false;
  private formSubmitAttempt: boolean;

  ngOnInit() {
    this.pointsObservable = this.db.list('/shuttle-points').valueChanges();
    this.form = this.fb.group({
      month: [this.months[new Date().getMonth()], Validators.required],
      year: [new Date().getFullYear().toString(), Validators.required],
    });
    
  }
  
  bookingReportList: any[];

  download(){
    this.processing = true;
      this.filterData = {
        type: this.form.value.type,
        assemblyPoint: this.form.value.assemblyPoint,
        month: this.form.value.month,
        year: this.form.value.year
      }
      this.http.post('/download-booking-report', this.filterData).subscribe(res => {
        console.log('show booking ' + (res.json()));
        this.bookingList = res.json();
        this.excelServ.exportAsExcelFile(this.bookingList, 'Booking Report ' + this.form.value.month + ' ' + this.form.value.year);
        this.processing = false;
      }, error => {
        this.toastrService.error('Lost Connection!');
        this.processing = false;
      });
      this.formSubmitAttempt = true;
    
  }
  
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
  getReport(){

  }
}
