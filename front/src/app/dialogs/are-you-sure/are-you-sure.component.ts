import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.less']
})
export class AreYouSureComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<AreYouSureComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { msg: string, affirmative: string, negative: string }
  ) { }

  ngOnInit() {
  }

  negative() {
    this.dialogRef.close(false);
  }

  affirmative() {
    this.dialogRef.close(true);
  }

}
