import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, EmailValidator } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { AngularFireDatabase } from 'angularfire2/database'
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { ChangePhoneNoComponent } from '../change-phone-no/change-phone-no.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';



@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  form: FormGroup;
  userData: {
    name: '',
    nip: '',
    program: '',
    phoneNo: '',
    email: ''
  };
  private formSubmitAttempt: boolean;
  constructor(
    private http: Http,
    private db: AngularFireDatabase,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.spinner.show();

    this.http.post('/get-user-detail', {}).subscribe(data => {
      this.userData = data.json();
      console.log(JSON.stringify(this.userData));
      this.spinner.hide();
    }, error => {
      this.toastrService.error('Lost Connection!');
      this.spinner.hide();
    });
    this.userData = {
      name: '',
      nip: '',
      program: '',
      phoneNo: '',
      email: ''
    };

  }

  changeEmail(){
    this.dialog.open(ChangeEmailComponent, {
      width: '500px'
    }).afterClosed().subscribe(res => {
      if(res != null){
        this.userData.email = res;
      }
    });
  }

  changePhoneNo(){
    this.dialog.open(ChangePhoneNoComponent, {
      width: '500px'
    }).afterClosed().subscribe(res => {
      if(res != null){
        this.userData.phoneNo = res;
      }
    });
  }

  changePassword(){
    this.dialog.open(ChangePasswordComponent, {
      width: '500px'
    });
  }
}
