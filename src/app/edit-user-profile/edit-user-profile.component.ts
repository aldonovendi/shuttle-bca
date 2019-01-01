import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  private processing = false;

  constructor(
    private http: Http,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<EditUserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      key: '',
      name: '',
      nip: '',
      program: '',
      phoneNo: '',
      email: '',
    }
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      nip: [this.data.nip, Validators.required],
      program: [this.data.program, Validators.required],
      phoneNo: [this.data.phoneNo, Validators.required],
      email: [this.data.email, Validators.required],
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {

    var userData = {
      key: this.data.key,
      name: this.form.value.name,
      nip: this.form.value.nip,
      program: this.form.value.program,
      phoneNo: this.form.value.phoneNo,
      email: this.form.value.email,
    }

    this.processing = true;
    this.http.post('/edit-user-data', userData).subscribe(data => {
      console.log('tesssss' + data);
      this.toastrService.success('You have edit ' + userData.name + "'s point", 'Edit Success');
      this.form.reset();
      this.processing = false;
      this.dialogRef.close(userData);
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
