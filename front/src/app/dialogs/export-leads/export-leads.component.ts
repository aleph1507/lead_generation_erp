import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-export-leads',
  templateUrl: './export-leads.component.html',
  styleUrls: ['./export-leads.component.less']
})
export class ExportLeadsComponent implements OnInit {

  selectedStatuses = {
    contacted: true,
    accepted: true,
    rejected: true,
    lead: true
  };

  constructor(
      public dialogRef: MatDialogRef<ExportLeadsComponent>
  ) { }

  ngOnInit() {
  }

  selectedCheck(): boolean {
    Object.keys(this.selectedStatuses).forEach((key)  => {
      if (this.selectedStatuses[key]) {
        return true;
      }
    });
    return false;
  }

  export() {
    this.dialogRef.close(this.selectedStatuses);
  }

  close() {
    this.dialogRef.close();
  }

}
