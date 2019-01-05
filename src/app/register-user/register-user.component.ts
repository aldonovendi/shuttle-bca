import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RegisterUser } from './register-user.model';
import { ToastrService } from 'ngx-toastr';
import { Http } from '@angular/http';
import * as XLSX from 'xlsx';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  form: FormGroup;
  private formSubmitAttempt: boolean;
  processing = false;
  uploadProcessing = false;
  constructor(
    private db: AngularFireDatabase,
    private toastrService: ToastrService,
    private http: Http,
    private fb: FormBuilder,
  ) { }

  newUser: RegisterUser = new RegisterUser();

  // @ViewChild('registerUserForm') formDirective: FormGroupDirective;

  registerUser() {
    this.processing = true;
    var userObj = {
      name: this.form.value.name,
      nip: this.form.value.nip,
      program: this.form.value.program,
      phoneNo: this.form.value.phoneNo,
      email: this.form.value.email
    }
    // this.db.list('/user').push(userObj);
    // this.sendEmail(userObj);
    this.http.post('/register-success', userObj).subscribe(data => {
      console.log('tesssss' + data);
      this.toastrService.success('An email has been sent to ' + this.form.value.email, this.form.value.name + ' register success');
      this.form.reset();
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

  sendEmail(userObj: object) {
    // console.log(bookingObj);

    return this.http.post('/register-success', userObj).subscribe(data => {
      console.log('tesssss' + data);
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      nip: ['', Validators.required],
      program: ['', Validators.required],
      phoneNo: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  arrayBuffer: any;
  file: File;
  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
    let fileReader = new FileReader();
    this.uploadProcessing = true;
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(excelData.length);
      for (let i = 0; i < excelData.length; i++) {
        this.http.post('/register-success', excelData[i]).subscribe(data => {
          var userData = JSON.parse(JSON.stringify(excelData[i]));
          this.toastrService.success('An email has been sent to ' + userData.email, userData.name + ' register success');
          // console.log('tesssss' + );
    this.uploadProcessing = false;
        }, error => {
          if (error.status == 501) {
            this.toastrService.error('Email already in use');
          } else{
            this.toastrService.error('Lost Connection');
          }
    this.uploadProcessing = false;
        });
      }
    }
    fileReader.readAsArrayBuffer(this.file);
  }
}
