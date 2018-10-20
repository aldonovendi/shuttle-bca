import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { auth } from 'firebase';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  form: FormGroup;
  newEmail: String;
  constructor(private fb: FormBuilder, private http: Http, private toastrService: ToastrService) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched)
    );
  }

  @ViewChild('form') formDirective: FormGroupDirective;

  authFailed: boolean = false;
  changeEmail(){
    this.authFailed = false;
    this.newEmail = this.form.value.email;
    this.http.post('change-email', this.form.value).subscribe(data => {
      this.toastrService.success('An email has been set to ' + this.newEmail, 'Change Email Success');
    }, error => {
      console.log("auth failed" + error);
      this.authFailed = true;
    })
    this.form.reset();
  }
}
