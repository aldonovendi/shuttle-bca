import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, PageEvent } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EditUserProfileComponent } from '../edit-user-profile/edit-user-profile.component';
import { MatTableDataSource, MatPaginator } from '@angular/material';

// export interface userElement {
//   key: string,
//   name: string,
//   nip: string,
//   program: string, 
//   email: string
// }

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
}) 

// const ELEMENT_DATA: userElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

export class ManageUserComponent implements OnInit {
  // userElements: userElement[];
  userList: any[];

  displayedColumns: string[] = ['position', 'name', 'nip', 'program', 'phoneNo', 'email', 'action'];
  dataSource: any;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  processing = false;
  constructor(
    private http: Http,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  deleteUser(userObj: Object, userName: String) {
    // console.log(JSON.stringify(userObj));
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {msg: "Are you sure to delete " + JSON.parse(JSON.stringify(userObj)).name + "?"}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
        this.processing = true;
        this.http.post('/delete-user', userObj).subscribe(data => {
          this.toastrService.success('This user has been deleted', 'Delete Success');
          var index = this.userList.findIndex(user => user.key === JSON.parse(JSON.stringify(userObj)).key)
          this.userList.splice(index, 1);
          this.dataSource = new MatTableDataSource(this.userList);
          this.dataSource.paginator = this.paginator;
          this.processing = false;
        }, error => {
          this.toastrService.error('Lost Connection!');
          this.processing = false;
        });
      }
    });
  }

  editUser(userObj: Object){
    const dialogRef = this.dialog.open(EditUserProfileComponent, {
      width: '750px',
      data: userObj
    }).afterClosed().subscribe(res => {
      if(res != null){
        var index = this.userList.findIndex(user => user.key === JSON.parse(JSON.stringify(userObj)).key);
        
        this.userList[index] = res;
        this.dataSource = new MatTableDataSource(this.userList);
        this.dataSource.paginator = this.paginator;
      }
          
    });
    
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  // @ViewChild(MatPaginator) dataSource: MatTableDataSource<Element>;
  ngOnInit() {
    this.spinner.show();
    this.http.post('/show-user-list', {}).subscribe(res => {
      // this.testVar = res;
      console.log('show user ' + (res.json()));
      // this.userElements = res.json();
      this.userList = res.json();
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        return data.name.toLowerCase().includes(filter) || data.nip.toLowerCase().includes(filter);
      };
      this.spinner.hide();
      // console.log('show booking ' + this.testVar.json());
      // console.log('show booking ' + JSON.stringify(res.json()));
    });
  }

}
