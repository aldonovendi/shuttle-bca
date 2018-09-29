import { Component, OnInit, ViewChild } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { RegisterUser } from './register-user.model';
import { ToastrService } from 'ngx-toastr';
import { Http } from '@angular/http';

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
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();
  registerUserForm: FormGroup;

  constructor(private db: AngularFireDatabase, private toastrService: ToastrService, private http: Http) { }

  newUser: RegisterUser = new RegisterUser();

  @ViewChild('registerUserForm') formDirective: FormGroupDirective;
  
  registerUser(form: NgForm){
    var userObj = {
      name: form.value.name,
      nip: form.value.nip,
      division: form.value.division,
      program: form.value.program,
      email: form.value.email
    }
    // this.db.list('/user').push(userObj);
    // this.sendEmail(userObj);
    this.http.post('/register-success', userObj).subscribe(data => {
      console.log('tesssss'+data);
    });
    this.toastrService.success('An email has been sent to ' + form.value.email, form.value.name + ' register success');
    this.formDirective.resetForm();
  }

  sendEmail(userObj: object) {
    // console.log(bookingObj);
    
    return this.http.post('/register-success', userObj).subscribe(data => {
      console.log('tesssss'+data);
    });
  }

  ngOnInit() {

  }

}
