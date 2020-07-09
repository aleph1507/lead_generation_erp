import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {ClientService} from '../services/client.service';
import {Client} from '../models/Client';
import {Router} from '@angular/router';
import {LeadService} from '../services/lead.service';
import {MatDialog} from '@angular/material/dialog';
import {ExportLeadsComponent} from '../dialogs/export-leads/export-leads.component';
import {CsvDataService} from "../services/csv-data.service";

enum OPTIONS {
  PROSPECTSLIVE = 1 ,
  PROSPECTSTRASHED,
  CLIENTSLIVE,
  CLIENTSTRASHED,
  USERSLIVE,
  USERSTRASHED
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  @ViewChild('output', {static: true}) private chatContainer: ElementRef;

  options = OPTIONS;
  option: OPTIONS;

  trashedProspects = false;
  trashedClients = false;
  dialogSub: Subscription;

  constructor(
      private router: Router,
      private leadService: LeadService,
      private dialog: MatDialog,
      private csvDataService: CsvDataService
  ) { }

  ngOnInit() {
  }

  // newProspect() {
  //   this.option = OPTIONS.NEWPROSPECT;
  // }

  prospectsLive() {
    this.trashedProspects = false;
    this.option = OPTIONS.PROSPECTSLIVE;
  }

  prospectsTrashed() {
    this.trashedProspects = true;
    this.option = OPTIONS.PROSPECTSTRASHED;
  }

  clientLive() {
    this.trashedClients = false;
    this.option = OPTIONS.CLIENTSLIVE;
  }

  clientsTrashed() {
    this.trashedClients = true;
    this.option = OPTIONS.CLIENTSTRASHED;
  }

  usersLive() {
    this.option = OPTIONS.USERSLIVE;
  }

  usersTrashed() {
    this.option = OPTIONS.USERSTRASHED;
  }

  nullOption() {
    this.option = null;
  }

  openLeadsExportDialog() {
    const dialogRef = this.dialog.open(ExportLeadsComponent, {
      data: {

      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(res => {
      console.log('res:', res);
      if (res) {
        this.leadService.export({status: res}).subscribe(exportData => {
          console.log(exportData);
          CsvDataService.exportToCsv('prospects.csv', exportData);
          // this.csvDataService.exportToCsv(exportData);
          // this.leadService.downloadFile(exportData);
        });
      }
    });
  }

  exportProspects() {
    this.leadService.export({status: 'ACCEPTED'}).subscribe(res => {
      console.log('export res: ', res);
      this.leadService.downloadFile(res);
    });
    // this.leadService.export({client_id: 1, status: 'ACCEPTED'}).subscribe(res => {
    //   console.log('export res: ', res);
    // });
  }

}
