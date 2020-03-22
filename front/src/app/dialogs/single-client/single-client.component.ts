import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Client} from '../../models/Client';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../services/client.service';

@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.less']
})
export class SingleClientComponent implements OnInit {

  clientForm: FormGroup;
  client: Client;

  constructor(
    public dialogRef: MatDialogRef<SingleClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.client = this.data ? (this.data.client ? this.data.client : new Client()) : new Client();
    this.clientForm = this.createClientForm();
  }

  save() {
    if (this.clientForm.controls) {
      if (this.clientForm.controls.name &&
          this.clientForm.controls.name.value) {

        this.client.name = this.clientForm.controls.name.value;
      }

      if (this.clientForm.controls.description) {
          this.client.description = this.clientForm.controls.description.value;
      }

      if (this.clientForm.controls.csv_file &&
          this.clientForm.controls.csv_file.value &&
          this.clientForm.controls.csv_file.value.files &&
          this.clientForm.controls.csv_file.value.files[0]) {

        this.client.csv_file = this.clientForm.controls.csv_file.value.files[0];
      }

    }

    if (this.data && this.data.client) {
      if (this.clientForm.valid) {
        this.clientService.updateClient(this.client).subscribe(result => {
          this.dialogRef.close(result);
        });
      }
    } else {
      if (this.clientForm.valid) {
        this.clientService.storeClient(this.client).subscribe(result => {
          this.dialogRef.close(result);
        });
      }
    }

  }

  close() {
    this.dialogRef.close(this.data);
  }

  createClientForm() {
    return new FormGroup({
      name: new FormControl(this.client.name, {
        validators: [Validators.required]
      }),
      description: new FormControl(this.client.description, { }),
      csv_file: new FormControl(null, { })
    });
  }

}
