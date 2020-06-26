import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSort, MatTableDataSource} from '@angular/material';
import {ClientService} from '../../services/client.service';
import {Client} from '../../models/Client';
import {Lead} from '../../models/Lead';
import {Subscription, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SingleLeadComponent} from '../single-lead/single-lead.component';
import {SNACKBAR} from '../../enums/snackbar.enum';
import {SnackbarService} from '../../services/snackbar.service';
import {DeleteLeadComponent} from '../single-lead/delete-lead/delete-lead.component';
import {LeadService} from '../../services/lead.service';

// noinspection DuplicatedCode,DuplicatedCode
@Component({
  selector: 'app-client-leads',
  templateUrl: './client-leads.component.html',
  styleUrls: ['./client-leads.component.less']
})
export class ClientLeadsComponent implements OnInit {

  leads: Lead[];
  deletedLeadsCount = 0;
  private dialogSub: Subscription = null;
  private leadsDataSource = new MatTableDataSource(this.leads);

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns = ['name', 'status', 'profile', 'edit', 'delete'];

  constructor(
    public dialogRef: MatDialogRef<ClientLeadsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {client: Client},
    private clientService: ClientService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private leadService: LeadService
  ) { }

  ngOnInit() {
    this.getLeads();
  }

  handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  getLeads() {
    console.log('data: ', this.data);
    this.clientService.getClientLeads(this.data.client).subscribe(leads => {
      console.log(leads);
      catchError(this.handleError);
      this.leads = leads.data;
      this.leadsDataSource.data = this.leads;
      this.leadsDataSource.sort = this.sort;
    });
  }

  isLead(data) {
    return !!((data && typeof data === 'object') &&
      (data.created_at && data.updated_at));


  }

  openDialog(lead: Lead = null) {
    const dialogRef = this.dialog.open(SingleLeadComponent, {
      height: '60%',
      width: '80%',
      data: {
        lead
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        if (lead !== null) {
          if (result.data.success) {
            this.snackbarService.openSnackbar('Prospect edited.');
          } else {
            this.snackbarService.openSnackbar('There has been a problem editing the prospect.', SNACKBAR.DANGER);
          }
        }

        if (lead === null) {
          if (this.isLead(result.data)) {
            if (!result.data.status) {
              result.data.status = 'CONTACTED';
            }
            this.leads[this.leads.length] = result.data;
            this.leadsDataSource.data = this.leads;
            this.leadsDataSource.sort = this.sort;
            this.snackbarService.openSnackbar('Prospect added.', SNACKBAR.SUCCESS);
          } else {
            this.snackbarService.openSnackbar('There has been a problem adding the prospect.', SNACKBAR.DANGER);
          }
        }
      }
    });
  }

  deleteDialog(lead: Lead) {
    const dialogRef = this.dialog.open(DeleteLeadComponent, {
      width: '60%',
      data: {
        lead
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leadService.deleteLead(lead.id).subscribe(deletionResult => {
          for (let i = 0; i < this.leads.length; i++) {
            if (this.leads[i].id === deletionResult.data.id) {
              this.leads.splice(i, 1);
              this.leadsDataSource.data = this.leads;
              this.leadsDataSource.sort = this.sort;
              this.snackbarService.openSnackbar('Lead deleted.', SNACKBAR.DANGER);
              break;
            }
          }
        });
      }
    });
  }

  closeDialog() {
    console.log('closeDialog');
    this.dialogRef.close(this.data);
  }



}
