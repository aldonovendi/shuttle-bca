import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

import { ChangeEmailComponent } from '../change-email/change-email.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-user-profile-admin',
  templateUrl: './user-profile-admin.component.html',
  styleUrls: ['./user-profile-admin.component.scss']
})
export class UserProfileAdminComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private processing = false;

  userData: {
    name: '',
    nip: '',
    program: '',
    phoneNo: '',
    email: '',
  };
  constructor(
    private http: Http,
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
      this.form = this.fb.group({
        name: [this.userData.name, Validators.required],
        nip: [this.userData.nip, Validators.required],
        program: [this.userData.program, Validators.required],
        phoneNo: [this.userData.phoneNo, Validators.required],
      });
      this.spinner.hide();
    }, error => {
      this.toastrService.error('Lost Connection!');
      this.spinner.hide();
    });
    this.form = this.fb.group({
      name: ['', Validators.required],
      nip: ['', Validators.required],
      program: ['', Validators.required],
      phoneNo: ['', Validators.required],
    });
    this.userData = {
      name: '',
      nip: '',
      program: '',
      phoneNo: '',
      email: '',
    };
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
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


  changePassword(){
    this.dialog.open(ChangePasswordComponent, {
      width: '500px'
    });
  }
  onSubmit() {

    var userData = {
      name: this.form.value.name,
      nip: this.form.value.nip,
      program: this.form.value.program,
      phoneNo: this.form.value.phoneNo,
    }

    this.processing = true;
    this.http.post('/edit-admin-data', userData).subscribe(data => {
      console.log('tesssss' + data);
      this.toastrService.success('You have edit your personal information', 'Edit Success');
      this.processing = false;
    }, error => {
      if (error.status == 501) {
        this.toastrService.error('Email already in use');
      } else{
        this.toastrService.error('Lost Connection');
      }
      this.processing = false;

    });
    this.formSubmitAttempt = true;
  }

  resetForm(){
    this.spinner.show();
    this.http.post('/get-user-detail', {}).subscribe(data => {
      this.userData = data.json();
      console.log(JSON.stringify(this.userData));
      this.form = this.fb.group({
        name: [this.userData.name, Validators.required],
        nip: [this.userData.nip, Validators.required],
        program: [this.userData.program, Validators.required],
        phoneNo: [this.userData.phoneNo, Validators.required],
      });
      this.spinner.hide();
    }, error => {
      this.toastrService.error('Lost Connection!');
      this.spinner.hide();
    });
  }
}
