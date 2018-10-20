import { Component, OnInit } from '@angular/core';
import {ExcelService} from '../services/excel.service';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map'
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  private history_data = [{
    'name': '',
    'program': '',
    'phoneNo': '',
    'date': '',
    'from': '',
    'to': '',
  }];
  private keys = [];
  private year = '';
  private month = '';
  private time = {
    month: '',
    year: ''
  }
  private bookingList: any[];
  private bookingListLength;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private client:HttpClient, 
    private http: Http,
    private excelServ:ExcelService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.month = this.route.snapshot.paramMap.get('month');
    this.year = this.route.snapshot.paramMap.get('year');

    this.time = {
      month: this.month,
      year: this.year
    }

    this.spinner.show();
    this.http.post('/show-booking-report', this.time).subscribe(res => {
      // this.testVar = res;
      console.log('show booking ' + (res.json()));
      
      this.bookingList = res.json();
      this.bookingListLength = this.bookingList.length;
      this.spinner.hide();
      // console.log('show booking ' + this.testVar.json());
      // console.log('show booking ' + JSON.stringify(res.json()));
    });
    // this.client.get('https://ejhail-ajah.firebaseio.com/report_booking/' + this.year + '/' + this.month + '.json').subscribe((res : any[])=>{
    //   this.keys = Object.keys(res);
    //   console.log(this.keys.length);
      
      
    //   for (let i = 0; i < this.keys.length; i++) {
    //     console.log(res[this.keys[i]]);
    //     this.history_data[i].name = res[this.keys[i]].name;
    //     this.history_data[i].program = res[this.keys[i]].program;
    //     this.history_data[i].phoneNo = res[this.keys[i]].phoneNo;
    //     this.history_data[i].date = res[this.keys[i]].date;
    //     this.history_data[i].from = res[this.keys[i]].from;
    //     this.history_data[i].to = res[this.keys[i]].to;
    //     console.log(this.history_data[i]);
        
    //   }
    //   this.spinner.hide();
    // },
    // error => {
    //   console.log("No data");
    //   this.spinner.hide();  
    // });
  
  
  }

  download(){
    this.excelServ.exportAsExcelFile(this.history_data, 'sample');
  }

  cancelBooking(bookingObj: Object){
    this.http.post('/cancel-booking', bookingObj).subscribe(data => {
      var index = this.bookingList.findIndex(booking => booking.key === JSON.parse(JSON.stringify(bookingObj)).key)
      this.bookingList.splice(index ,1);
      this.bookingListLength = this.bookingList.length;
      this.toastrService.success('This booking has been canceled', 'Cancel Success');
        // try {
        //   this.client.get('https://ejhail-ajah.firebaseio.com/report_booking/' + this.year + '/' + this.month + '.json').subscribe((res : any[])=>{
        //     this.keys = Object.keys(res);
        //     for (let i = 0; i < this.keys.length; i++) {
        //       this.history_data[i] = res[this.keys[i]];
        //     }
        //     this.spinner.hide();  
        //     console.log(this.history_data);
        //     delete this.history_data[name];
        //     console.log(this.history_data);
        //   });
        // } catch (error) {
        //   console.log("No data");
          
        // }
    }, error => {
      this.toastrService.error('Lost Connection!');
    });
  }
}
