import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {LeadService} from '../../services/lead.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ClientService} from '../../services/client.service';
import {Client} from '../../models/Client';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-leads-csv',
  templateUrl: './leads-csv.component.html',
  styleUrls: ['./leads-csv.component.less']
})
export class LeadsCsvComponent implements OnInit {

  leadCSVForm: FormGroup;
  // tslint:disable-next-line:variable-name
  client_id = new FormControl(null, {
    validators: [Validators.required]
  });
  clients: any;
  isLoading: boolean;

  constructor(
    public dialogRef: MatDialogRef<LeadsCsvComponent>,
    private leadService: LeadService,
    private clientsService: ClientService
  ) { }

  ngOnInit() {
    this.leadCSVForm = this.createLeadCSVForm();
    this.client_id.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.clients = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          return this.clientsService.searchClients(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          );
        })
      ).subscribe(data => {
        this.clients = data.data;
    });
  }

  displayFn(client?: Client): string | undefined {
    return client ? client.name : undefined;
  }

  save() {
    const CSVFile = this.leadCSVForm.controls.csv_file.value;
    const clientId = this.leadCSVForm.controls.client_id.value;
    this.close({
      CSVFile,
      clientId
    });
  }

  close(result: any = null) {
    this.dialogRef.close(result);
  }

  createLeadCSVForm() {
    return new FormGroup({
      csv_file: new FormControl(null, {
        validators: [Validators.required]
      }),
      client_id: this.client_id
    });
  }
}
