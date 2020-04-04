import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../models/User';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.less']
})
export class DeleteUserComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<DeleteUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(false);
  }

  delete() {
    this.dialogRef.close(true);
  }
}
