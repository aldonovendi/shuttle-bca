import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from '../services/excel.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, PageEvent } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})

export class BookingReportComponent implements OnInit {
  form: FormGroup;
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  years: String[] = ["2018"];
  displayedColumns: string[] = ['position', 'name', 'nip', 'program', 'phoneNo', 'action'];
  dataSource: any;
  todayDate = new Date();
  maxDate = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate() + 20 - this.todayDate.getDay());
  
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  date = new FormControl(new Date());
  dateValue = this.date.value;
  update(dateInput: string) {
    this.dateValue = dateInput
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private filterData = {
    type: '',
    assemblyPoint: '',
    date: '',
    month: '',
    year: ''
  }
  constructor(
    private http: Http,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private toastrService: ToastrService,
    private excelServ:ExcelService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
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
      date: this.form.value.date.getDate(),
      month: this.months[this.form.value.date.getMonth()],
      year: this.form.value.date.getFullYear()
    }
    this.spinner.show();
    console.log("data filter: " + this.filterData);
    
    this.http.post('/show-booking-report', this.filterData).subscribe(res => {
      // this.testVar = res;
      console.log('show booking ' + JSON.stringify(res.json()));
      
      this.bookingList = res.json();
      this.dataSource = new MatTableDataSource(this.bookingList);
      this.dataSource.paginator = this.paginator;
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
      date: ['', Validators.required],
      // month: [this.months[new Date().getMonth()], Validators.required],
      // year: [new Date().getFullYear().toString(), Validators.required],
    });
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.nip.toLowerCase().includes(filter);
    };
  }
  bookingReportList: any[];
  
  changeDateFormat(date: String){
    var newDate = date.split("-");
    return newDate[0] + " " + this.months[+newDate[1]-1] + " " + newDate[2];
  }
  cancelBooking(bookingObj: Object, userName: String){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {msg: "Are you sure to cancel "+ userName +"'s booking?"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.processing = true;
        this.http.post('/cancel-booking', bookingObj).subscribe(data => {
          var index = this.bookingList.findIndex(booking => booking.key === JSON.parse(JSON.stringify(bookingObj)).key)
          this.bookingList.splice(index ,1);
          this.bookingListLength = this.bookingList.length;
          this.dataSource = new MatTableDataSource(this.bookingList);
          this.dataSource.paginator = this.paginator;
          this.toastrService.success('This booking has been canceled', 'Cancel Success');
          this.processing = false;
        }, error => {
          this.toastrService.error('Lost Connection!');
          this.processing = false;
        });
      }
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
