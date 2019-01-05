import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';

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
    private toastrService: ToastrService,

  ) { }
  processing = false;
  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      position: ['', Validators.required],
      departure: ['', Validators.required],
    });
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    var shuttlePointObj = {
      name: this.form.value.name,
      departure: this.form.value.departure,
      img: '../assets/img/maps/' + this.form.value.name + '.jpg',
      lat: this.form.value.lat,
      lng: this.form.value.lng,
      position: this.form.value.position,
    }
    this.processing = true;
    this.http.post('/add-shuttle-point', shuttlePointObj).subscribe(data => {
      console.log('tesssss' + data);
      this.toastrService.success('Submitted succesfully, check your email', 'Add Booking');
      this.form.reset();
      this.processing = false;
    }, error => {
      this.toastrService.error('Lost Connection!');
      this.processing = false;
    });
    this.formSubmitAttempt = true;
  }
  
}
