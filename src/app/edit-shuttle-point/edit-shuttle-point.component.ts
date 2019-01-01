import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


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
    public dialogRef: MatDialogRef<EditShuttlePointComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: '',
      lat: '',
      lng: '',
      position: '',
      departure: '',
    }
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
      name: [{ value: this.data.name, disabled: true }, Validators.required],
      lat: [this.data.lat, Validators.required],
      lng: [this.data.lng, Validators.required],
      position: [this.data.position, Validators.required],
      departure: [this.data.departure, Validators.required],
    });
    //   console.log('tesssss' + res.json());
    //   this.processing = false;
    // }, error => {
    //   this.toastrService.error('Lost Connection!');
    //   this.processing = false;
    // });

  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {

    var shuttlePointObj = {
      name: this.form.getRawValue().name,
      departure: this.form.value.departure,
      lat: this.form.value.lat,
      lng: this.form.value.lng,
      position: this.form.value.position,
    }

    this.processing = true;
    this.http.post('/add-shuttle-point', shuttlePointObj).subscribe(data => {
      console.log('tesssss' + data);
      this.toastrService.success('You have edit ' + shuttlePointObj.name + "'s point", 'Edit Success');
      this.form.reset();
      this.processing = false;
      this.dialogRef.close();

    }, error => {
      this.toastrService.error('Lost Connection!');
      this.processing = false;

    });
    this.formSubmitAttempt = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
