import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../auth/auth.service';
import { Http } from '@angular/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private isConnect: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: Http,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.http.post('/login-success', this.form.value).subscribe(data => {
        console.log('Login success' + data);
        this.authService.login(this.form.value);
        this.spinner.hide();
      }, error => {
        if (error.status == 400) {
          console.log("Lost Connection!");
          this.toastrService.error('Lost Connection!');
          this.isConnect = false;  
        } else{
          this.toastrService.error('Invalid username or password');
          console.log("auth failed" + error);
        }
        this.spinner.hide();
      });
      console.log(this.form.value);
      
    }
    this.formSubmitAttempt = true;
  }
}