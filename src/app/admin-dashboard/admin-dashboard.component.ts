import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Http } from '@angular/http';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = ['assemblyPoint', 'passengerCountDay1', 'passengerCountDay2', 'passengerCountDay3', 'passengerCountDay4', 'passengerCountDay5'];
  private passengerCountDate: String[] = new Array(5);
  days: String[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  private passengerList: any[];

  constructor(
    private http: Http,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit() {
    this.spinner.show();

    var todayDate = new Date();
    var firstDay;
    var addIdx;
    if(todayDate.getDay() == 0){
      addIdx = 1;
    } else {
      addIdx = 8 - todayDate.getDay();
    }
    for (let i = 0; i < this.passengerCountDate.length; i++) {
      firstDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + addIdx + i);
      this.passengerCountDate[i] = this.changeDateFormat(firstDay);
    }
    this.http.post('/get-passenger-count', {}).subscribe(res => {
      // this.testVar = res;
      console.log('show passenger ' + JSON.stringify(res.json()));
      
      this.passengerList = res.json();
      this.dataSource = new MatTableDataSource(this.passengerList);
      this.spinner.hide();
    });
  }
  changeDateFormat(date: Date){
    return this.days[date.getDay()] + ", " + date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
  }
}
