import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  processing = false;
  constructor(
    private fb: FormBuilder,
    private http: Http,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.email]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
  onSubmit(): void {
    this.processing = true;
    if (this.form.valid) {
      this.http.post('/forgot-password', this.form.value).subscribe(data => {
        console.log('forgot pass success' + data);
        this.toastrService.success('A reset link has been sent to your email', 'Please check your email');
        this.form.reset();
    this.processing = false;
      }, error => {
        console.log("error: " + error.status);
        if(error.status == 400){
          this.toastrService.error("There's no user with this email address", 'Invalid email');
        } else{
          this.toastrService.error('Please double check your email address', 'Invalid email');
        }
        this.processing = false;
      });
    }
    this.formSubmitAttempt = true;
  }
}
