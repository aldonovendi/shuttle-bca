import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(
    private db: AngularFireDatabase, 
    private er: ElementRef, 
    private http: Http, 
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  changeDateFormat(date: String){
    var newDate = date.split("-");
    return this.month[+newDate[1]-1] + " " + newDate[0] + ", " + newDate[2];
  }

  sendEmail(bookingObj: Object){
    console.log(bookingObj);
    
    this.http.post('/send-booking-detail', bookingObj).subscribe(data => {
      console.log('tesssss'+data);
    }, error => {
      this.toastrService.error('Lost Connection!');
    });
    this.toastrService.success('Please check your email', 'An email has been sent');
  }

  cancelBooking(bookingObj: Object){
    this.http.post('/cancel-booking', bookingObj).subscribe(data => {
      this.toastrService.success('Your booking has been canceled', 'Cancel Success');
      var index = this.bookingList.findIndex(booking => booking.key === JSON.parse(JSON.stringify(bookingObj)).key)      
      this.bookingList.splice(index ,1);
      this.bookingListLength = this.bookingList.length;
    }, error => {
      this.toastrService.error('Lost Connection!');
    })
    
  }

  changePage(event: any) {
    if (event.target.text >= 1 && event.target.text <= this.numberOfPaginators) {
      this.activePage = +event.target.text;
      this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
      this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    }
  }

  nextPage(event: any) {
    if (this.pages.last.nativeElement.classList.contains('active')) {
      if ((this.numberOfPaginators - this.numberOfVisiblePaginators) >= this.lastVisiblePaginator) {
        this.firstVisiblePaginator += this.numberOfVisiblePaginators;
      this.lastVisiblePaginator += this.numberOfVisiblePaginators;
      } else {
        this.firstVisiblePaginator += this.numberOfVisiblePaginators;
      this.lastVisiblePaginator = this.numberOfPaginators;
      }
    }

    this.activePage += 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  previousPage(event: any) {
    if (this.pages.first.nativeElement.classList.contains('active')) {
      if ((this.lastVisiblePaginator - this.firstVisiblePaginator) === this.numberOfVisiblePaginators)  {
        this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
        this.lastVisiblePaginator -= this.numberOfVisiblePaginators;
      } else {
        this.firstVisiblePaginator -= this.numberOfVisiblePaginators;
        this.lastVisiblePaginator -= (this.numberOfPaginators % this.numberOfVisiblePaginators);
      }
    }

    this.activePage -= 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
  }

  firstPage() {
    this.activePage = 1;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;
    this.firstVisiblePaginator = 0;
    this.lastVisiblePaginator = this.numberOfVisiblePaginators;
  }

  lastPage() {
    this.activePage = this.numberOfPaginators;
    this.firstVisibleIndex = this.activePage * this.itemsPerPage - this.itemsPerPage + 1;
    this.lastVisibleIndex = this.activePage * this.itemsPerPage;

    if (this.numberOfPaginators % this.numberOfVisiblePaginators === 0) {
      this.firstVisiblePaginator = this.numberOfPaginators - this.numberOfVisiblePaginators;
      this.lastVisiblePaginator = this.numberOfPaginators;
    } else {
      this.lastVisiblePaginator = this.numberOfPaginators;
      this.firstVisiblePaginator = this.lastVisiblePaginator - (this.numberOfPaginators % this.numberOfVisiblePaginators);
    }
  }
// testVar: any;

private bookingListLength;
  ngOnInit() {
    
    // this.bookingList = this.db.list('/user').snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // });
    this.spinner.show();
    this.http.post('/show-booking-list', {}).subscribe(res => {
      // this.testVar = res;
      console.log('show booking ' + (res.json()));
      
      this.bookingList = res.json();
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
