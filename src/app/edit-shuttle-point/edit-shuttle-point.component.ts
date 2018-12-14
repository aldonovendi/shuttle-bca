import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-shuttle-point',
  templateUrl: './edit-shuttle-point.component.html',
  styleUrls: ['./edit-shuttle-point.component.scss']
})
export class EditShuttlePointComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
  constructor(
    private http: Http,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
  ) { }
  private filter = {
    shuttleName: ''
  }
  private processing = false;
  ngOnInit() {
    // this.filter = {
    //   shuttleName: this.route.snapshot.paramMap.get('name')
    // };
    // this.http.post('/get-shuttle-point-detail', this.filter).subscribe(res => {
      this.form = this.fb.group({
        name: ['', Validators.required],
        lat: ['', Validators.required],
        lng: ['', Validators.required],
        position: ['', Validators.required],
        departure: ['', Validators.required],
      });
    //   console.log('tesssss' + res.json());
    //   this.processing = false;
    // }, error => {
    //   this.toastrService.error('Lost Connection!');
    //   this.processing = false;
    // });
    console.log('hahaha');
    
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
