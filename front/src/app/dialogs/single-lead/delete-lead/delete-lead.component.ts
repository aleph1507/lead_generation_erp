import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-delete-lead',
  templateUrl: './delete-lead.component.html',
  styleUrls: ['./delete-lead.component.less']
})
export class DeleteLeadComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteLeadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
