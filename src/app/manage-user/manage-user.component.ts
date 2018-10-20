import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  userList: any[]

  constructor(
    private http: Http, 
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  deleteUser(userObj: Object){
    // console.log(JSON.stringify(userObj));
    this.http.post('/delete-user', userObj).subscribe(data => {
      this.toastrService.success('This user has been deleted', 'Delete Success');
      var index = this.userList.findIndex(user => user.key === JSON.parse(JSON.stringify(userObj)).key)
      this.userList.splice(index ,1);
    }, error => {
      this.toastrService.error('Lost Connection!');
    });    
  }

  ngOnInit() {
    this.spinner.show();
    this.http.post('/show-user-list', {}).subscribe(res => {
      // this.testVar = res;
      console.log('show booking ' + (res.json()));
      
      this.userList = res.json();
      this.spinner.hide();
      // console.log('show booking ' + this.testVar.json());
      // console.log('show booking ' + JSON.stringify(res.json()));
    });
  }

}
