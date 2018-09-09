import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

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
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate()+14);
  shuttlePoints = SHUTTLE_POINTS;
  defaultOption = new FormControl(this.shuttlePoints[2]); 
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  constructor() { }

  ngOnInit() {
  }

}
