import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  @ViewChildren('pages') pages: QueryList<any>;
  itemsPerPage = 10;
  numberOfVisiblePaginators = 10;
  numberOfPaginators: number;
  paginators: Array<any> = [];
  activePage = 1;
  firstVisibleIndex = 1;
  lastVisibleIndex: number = this.itemsPerPage;
  firstVisiblePaginator = 0;
  lastVisiblePaginator = this.numberOfVisiblePaginators;

  bookingList: any[]
  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  processing = false;
  emailProcessing = false;
  constructor(
    private db: AngularFireDatabase,
    private er: ElementRef,
    private http: Http,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  changeDateFormat(date: String) {
    var newDate = date.split("-");
    var systemDate = new Date(+newDate[2], +newDate[1]-1, +newDate[0]);
    
    return this.day[systemDate.getDay()] + ", " + newDate[0] + " " + this.month[+newDate[1] - 1] + " " + newDate[2];
  }

  sendEmail(bookingObj: Object) {
    this.emailProcessing = true;
    this.http.post('/send-booking-detail', bookingObj).subscribe(data => {
      console.log('tesssss' + data);
      this.emailProcessing = false;
      this.toastrService.success('Please check your email', 'An email has been sent');
    }, error => {
      this.emailProcessing = false;
      this.toastrService.error('Lost Connection!');
    });
  }
  cancelBooking(bookingObj: Object, bookingDate: String) {
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {msg: "Are you sure to cancel booking on " + this.changeDateFormat(bookingDate) + "?"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.processing = true;
        this.http.post('/cancel-booking', bookingObj).subscribe(data => {
          this.toastrService.success('Your booking has been canceled', 'Cancel Success');
          var index = this.bookingList.findIndex(booking => booking.key === JSON.parse(JSON.stringify(bookingObj)).key)
          this.bookingList.splice(index, 1);
          this.bookingListLength = this.bookingList.length;
          this.processing = false;

        }, error => {
          this.toastrService.error('Lost Connection!');
          this.processing = false;

        })
      }
    });
    

  }

  bookingListLength;
  private today;
  private todayKey;
  private idx;
  ngOnInit() {

    // this.bookingList = this.db.list('/user').snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // });
    this.spinner.show();
    this.idx = 0;
    this.today = new Date();
    this.todayKey = this.today.getFullYear()+this.today.getMonth()+this.today.getDate();
    this.http.post('/show-booking-list', {}).subscribe(res => {
      // this.testVar = res;
      console.log('show booking ' + (res.json()));

      this.bookingList = res.json();
      this.bookingList.forEach(bookingData => {
        if(this.todayKey > bookingData.key){
          this.bookingList.splice(this.idx,1);
        }
        this.idx++;
      });
      
      this.bookingListLength = this.bookingList.length;

      this.spinner.hide();
      // console.log('show booking ' + this.testVar.json());
      // console.log('show booking ' + JSON.stringify(res.json()));
    });
    // this.http.post('/booking-list', {a:'a'}).subscribe(data => {
    //   console.log('tesssss'+data);
    // });
    // if (60 % this.itemsPerPage === 0) {
    //   this.numberOfPaginators = Math.floor(60 / this.itemsPerPage);
    // } else {
    //   this.numberOfPaginators = Math.floor(60 / this.itemsPerPage + 1);
    // }

    // for (let i = 1; i <= this.numberOfPaginators; i++) {
    //   this.paginators.push(i);
    // }
  }

}

// @Component({
//   selector: 'cancel-confirmation',
//   templateUrl: 'cancel-confirmation.html',
// })
// export class CancelConfirmation {

//   constructor(
//     public dialogRef: MatDialogRef<CancelConfirmation>,
//     @Inject(MAT_DIALOG_DATA) public data: {}) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }