import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
  selector: 'app-add-shuttle-point',
  templateUrl: './add-shuttle-point.component.html',
  styleUrls: ['./add-shuttle-point.component.scss']
})
export class AddShuttlePointComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  constructor(
    private http: Http,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      desc: ['', Validators.required],
      departure: ['', Validators.required],
    });
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit(){
    this.formSubmitAttempt = true;
  }
}
