import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { EditShuttlePointComponent } from '../edit-shuttle-point/edit-shuttle-point.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

import 'rxjs/add/operator/map'

interface AssemblyPoint {
  name: string;
  lat: number;
  lng: number;
  img: string;
}

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable?: boolean;
}

export const SHUTTLE_POINTS = [
  { name: "Alam Sutera", lat: 0, lng: 0, img: "../assets/img/sidebar-1.jpg" },
  { name: "BCA Learning Institute", lat: -6.5852544, lng: 106.8823999, img: "../assets/img/maps/bca-learning-institute.jpg" },
  { name: "Bekasi", lat: -6.248678, lng: 106.993041, img: "../assets/img/maps/bekasi.jpg" },
  { name: "Bogor", lat: 0, lng: 0, img: "../assets/img/sidebar-4.jpg" },
  { name: "Kelapa Gading", lat: -6.169227, lng: 106.900269, img: "../assets/img/maps/kelapa-gading.jpg" },
  { name: "Pondok Indah", lat: 0, lng: 0, img: "../assets/img/sidebar-4.jpg" },
  { name: "Wisma Asia", lat: -6.189851, lng: 106.79775, img: "../assets/img/maps/wisma-asia.jpg" },
]

@Component({
  selector: 'app-shuttle-points-admin',
  templateUrl: './shuttle-points-admin.component.html',
  styleUrls: ['./shuttle-points-admin.component.scss']
})

export class ShuttlePointsAdminComponent implements OnInit {

  pointsCollection: AngularFirestoreCollection<AssemblyPoint>
  points: Observable<AssemblyPoint[]>

  pointsObservable: Observable<any[]>;

  zoom: number = 20;

  // shuttlePoints = SHUTTLE_POINTS;

  shuttlePoints: any[];

  constructor(
    private http: Http,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
  ) {
    // collection: AngularFirestoreCollection<> = db.collection
    // db.list('/shuttle-points').valueChanges()
    //     .subscribe(shuttlePoints => {
    //         this.shuttlePoints = shuttlePoints;
    //         console.log(shuttlePoints);
    //     })
  }

  ngOnInit() {
    // this.pointsCollection = this.db.collection('points')
    // this.points = this.pointsCollection.valueChanges()
    // console.log(this.points)
    this.spinner.show();
    this.db.list('/shuttle-points').valueChanges().subscribe(shuttlePoints => {
      this.shuttlePoints = shuttlePoints;
      console.log(shuttlePoints);
      this.spinner.hide();
    });



    // getShuttlePoints(listPath): Observable<any[]> {
    //   return this.db.list(listPath).valueChanges();
    // }
  }

  edit(shuttlePoint: Object){
    const dialogRef = this.dialog.open(EditShuttlePointComponent, {
      width: '750px',
      data: shuttlePoint
    });
  }

  delete(shuttlePoint: Object, shuttlePointName: String){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {msg: "Are you sure to delete "+ shuttlePointName +"'s point?"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.http.post('/delete-shuttle-point', shuttlePoint).subscribe(data => {
          this.toastrService.success(shuttlePointName + "'s point has been deleted", 'Delete Success');
        }, error => {
          this.toastrService.error('Lost Connection!');
        });
      }
    });
  }

}
