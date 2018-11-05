import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../services/excel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})

export class BookingReportComponent implements OnInit {
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
  private bookingListLength = 0;
  private processing = false;
  private formSubmitAttempt: boolean;

  filter(){
    this.filterData = {
      type: this.form.value.type,
      assemblyPoint: this.form.value.assemblyPoint,
      month: this.form.value.month,
      year: this.form.value.year
    }
    this.spinner.show();
    this.http.post('/show-booking-report', this.filterData).subscribe(res => {
      // this.testVar = res;
      console.log('show booking ' + (res.json()));
      
      this.bookingList = res.json();
      this.bookingListLength = this.bookingList.length;
      if(this.bookingListLength == 0){
        this.toastrService.warning("There's no Booking History");
      }
      this.spinner.hide();
      // console.log('show booking ' + this.testVar.json());
      // console.log('show booking ' + JSON.stringify(res.json()));
    });
    this.formSubmitAttempt = true;
  }
  ngOnInit() {
    this.pointsObservable = this.db.list('/shuttle-points').valueChanges();
    this.form = this.fb.group({
      type: ['Shuttle Bus', Validators.required],      
      assemblyPoint: ['', Validators.required],
      month: [this.months[new Date().getMonth()], Validators.required],
      year: [new Date().getFullYear().toString(), Validators.required],
    });
  }
  bookingReportList: any[];
  download(){
    if(this.bookingListLength != 0){
      this.excelServ.exportAsExcelFile(this.bookingList, 'Shuttle Report ' + this.form.value.month + " " + this.form.value.year);
    } else {
      this.filterData = {
        type: this.form.value.type,
        assemblyPoint: this.form.value.assemblyPoint,
        month: this.form.value.month,
        year: this.form.value.year
      }
      // this.db.list('/booking-report/Shuttle Bus/' + this.filterData.year + '/' + this.filterData.month).valueChanges().subscribe(bookingReportList => {
      //   this.bookingReportList = bookingReportList;
      //   console.log(bookingReportList);
      //   this.excelServ.exportAsExcelFile(this.bookingReportList, 'Booking Report ' + this.form.value.month + ' ' + this.form.value.year);

      // });
      this.http.post('/show-booking-report', this.filterData).subscribe(res => {
        console.log('show booking ' + (res.json()));
        this.bookingList = res.json();
        this.excelServ.exportAsExcelFile(this.bookingList, 'Booking Report ' + this.form.value.month + ' ' + this.form.value.year);
      });
      this.formSubmitAttempt = true;
    }
    
  }
  changeDateFormat(date: String){
    var newDate = date.split("-");
    return newDate[0] + " " + this.months[+newDate[1]-1] + " " + newDate[2];
  }
  cancelBooking(bookingObj: Object){
    this.processing = true;
    this.http.post('/cancel-booking', bookingObj).subscribe(data => {
      var index = this.bookingList.findIndex(booking => booking.key === JSON.parse(JSON.stringify(bookingObj)).key)
      this.bookingList.splice(index ,1);
      this.bookingListLength = this.bookingList.length;
      this.toastrService.success('This booking has been canceled', 'Cancel Success');
      this.processing = false;
    }, error => {
      this.toastrService.error('Lost Connection!');
      this.processing = false;
    });
    
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