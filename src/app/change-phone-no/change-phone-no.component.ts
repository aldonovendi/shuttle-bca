import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { auth } from 'firebase';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-change-phone-no',
  templateUrl: './change-phone-no.component.html',
  styleUrls: ['./change-phone-no.component.scss']
})
export class ChangePhoneNoComponent implements OnInit {
  form: FormGroup;
  newPhoneNo: String;
  private processing = false;

  constructor(
    private fb: FormBuilder, 
    private http: Http, 
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<ChangePhoneNoComponent>,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      phoneNo: ['', Validators.required],
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
  changePhoneNo(){
    this.processing = true;
    this.authFailed = false;
    this.newPhoneNo = this.form.value.phoneNo;
    this.http.post('change-phone-no', this.form.value).subscribe(data => {
      this.toastrService.success('Your Phone Number has been set to ' + this.newPhoneNo, 'Change Phone Number Success');
      this.processing = false;
      this.dialogRef.close(this.form.value.phoneNo);
      this.form.reset();
    }, error => {
      if(error.status = 500){
        this.toastrService.error('Incorrect Password');
      } else{
        this.toastrService.error('Lost Connection!');
      }
      this.authFailed = true;
      this.processing = false;
    })
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
