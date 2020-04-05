import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Client} from '../../models/Client';
import {ClientService} from '../../services/client.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../models/User';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  // userForm: FormGroup;
  user: User;
  //
  constructor(
      public dialogRef: MatDialogRef<UserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { user: User },
      private authService: AuthService
  ) {}
  //
  ngOnInit() {
    this.user = this.data.user;
  //   this.userForm = this.crateUserForm();
  }

  updatedResult($event) {
    this.closeWithEvent($event);
  }

  closeWithEvent($event) {
    this.dialogRef.close($event);
  }
  //
  // save() {
  //   if (this.clientForm.controls) {
  //     if (this.clientForm.controls.name &&
  //         this.clientForm.controls.name.value) {
  //
  //       this.client.name = this.clientForm.controls.name.value;
  //     }
  //
  //     if (this.clientForm.controls.description) {
  //       this.client.description = this.clientForm.controls.description.value;
  //     }
  //
  //     if (this.clientForm.controls.csv_file &&
  //         this.clientForm.controls.csv_file.value &&
  //         this.clientForm.controls.csv_file.value.files &&
  //         this.clientForm.controls.csv_file.value.files[0]) {
  //
  //       this.client.csv_file = this.clientForm.controls.csv_file.value.files[0];
  //     }
  //
  //   }
  //
  //   if (this.data && this.data.client) {
  //     if (this.clientForm.valid) {
  //       this.clientService.updateClient(this.client).subscribe(result => {
  //         this.dialogRef.close(result);
  //       });
  //     }
  //   } else {
  //     if (this.clientForm.valid) {
  //       this.clientService.storeClient(this.client).subscribe(result => {
  //         this.dialogRef.close(result);
  //       });
  //     }
  //   }
  //
  // }
  //
  // close() {
  //   this.dialogRef.close(this.data);
  // }
  //
  // createUserForm() {
  //   return new FormGroup({
  //     name: new FormControl(this.client.name, {
  //       validators: [Validators.required]
  //     }),
  //     description: new FormControl(this.client.description, { }),
  //     csv_file: new FormControl(null, { })
  //   });
  // }

}
