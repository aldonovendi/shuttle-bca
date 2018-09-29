import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private http: Http, private toastrService: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched)
    );
  }

  isPasswordInvalid() {
    
    return (
      (this.form.get('confirmNewPassword').value != this.form.get('newPassword').value) && this.form.get('confirmNewPassword').touched
    );
  }

  changePassword(){
    this.http.post('change-password', this.form.value).subscribe(data => {
      this.toastrService.success('Your password has been updated', 'Change Password Success');
    }, error => {
      console.log("auth failed" + error);
    })
    this.form.reset();
  }

}
