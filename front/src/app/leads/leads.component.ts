import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Lead} from '../models/Lead';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {Observable, Subscription, throwError} from 'rxjs';
import {LeadService} from '../services/lead.service';
import {SnackbarService} from '../services/snackbar.service';
import {catchError} from 'rxjs/operators';
import {SingleLeadComponent} from '../dialogs/single-lead/single-lead.component';
import {SNACKBAR} from '../enums/snackbar.enum';
import {DeleteLeadComponent} from '../dialogs/single-lead/delete-lead/delete-lead.component';
import {LeadsCsvComponent} from '../dialogs/leads-csv/leads-csv.component';
import {SelectionModel} from '@angular/cdk/collections';
import {FormControl} from '@angular/forms';
import {AreYouSureComponent} from '../dialogs/are-you-sure/are-you-sure.component';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.less']
})
export class LeadsComponent implements OnInit, OnDestroy {
  @Input() trashed = false;
  @Input() clientsView = false;
  @Input() leadsInput = false;
  @Input() leadsFeed: Lead[] = [];

  private leads: Lead[];
  private leadsDataSource = new MatTableDataSource<Lead>(this.leads);
  private dialogSub: Subscription = null;
  private CSVUploadSub: Subscription;
  private columns = [];
  selection = new SelectionModel<Lead>(true, []);
  mainSpinner = true;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  // multiStatusChange = new FormControl();
  multiStatusChange = new FormControl(
      {value: null, disabled: this.selection.selected.length < 1}
  );

  statusList: string[] = ['Contacted', 'Accepted', 'Rejected', 'Lead'];

  // 'duxid', 'visitTime'
  displayedColumns = ['select', 'edit', 'delete', 'firstName', 'lastName', 'client', 'profile',
                    'status',  'degree',
                    'middleName', 'summary',
                    'title', 'from', 'company',
                    'companyProfile', 'companyWebsite', 'personalWebsite',
                    'email', 'phone', 'IM',
                    'twitter', 'location', 'industry',
                    'myTags', 'myNotes', 'created_at', 'updated_at'];

  // duxid, 'visitTime'
  displayedColumnsTrashed = ['restore', 'shred', 'firstName', 'lastName', 'status', 'client', 'profile',
    'degree', 'middleName', 'summary',
    'title', 'from', 'company',
    'companyProfile', 'companyWebsite', 'personalWebsite',
    'email', 'phone', 'IM',
    'twitter', 'location', 'industry',
    'myTags', 'myNotes', 'created_at', 'updated_at', 'deleted_at'];

  displayedColumnsClientsView = [
    'firstName', 'lastName', 'status', 'profile', 'degree', 'middleName', 'summary',
    'title', 'from', 'company', 'companyProfile', 'companyWebsite', 'personalWebsite',
    'email', 'phone', 'IM', 'twitter', 'location', 'industry',
    'myTags', 'myNotes', 'created_at', 'updated_at'
  ];

  constructor(
    private leadService: LeadService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.columns = this.leadsInput ? this.displayedColumnsClientsView :
      (this.trashed ? this.displayedColumnsTrashed : this.displayedColumns);
    // console.log('this.selection:', this.selection);
    if (this.leadsInput) {
      this.displayLeads(this.leadsFeed);
    } else {
      this.getAll();
    }
  }

  selectionFn($event) {
    const value = $event.value;

    const dialogRef = this.dialog.open(AreYouSureComponent, {
      data: {
        // msg: string, affirmative: string, negative: string
        msg: 'Change status to ' + value + ' for ' + this.selection.selected.length + ' prospects?',
        affirmative: 'Yes',
        negative: 'Cancel'
      }
    });

    this.unsub();

    this.dialogSub = dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log('value:', value);
        console.log('selection:', this.selection.selected);
        const changedNumber = this.selection.selected.length;
        this.mainSpinner = true;
        this.leadService.massStatusUpdate(this.selection.selected, value)
            .subscribe(updateRes => {
              console.log('massUpdateResult:', updateRes);
              this.selection.clear();
              this.getAll();
              this.mainSpinner = false;
              this.snackbarService.openSnackbar('Statuses changed to ' + value + ' for ' + changedNumber + ' prospects.', SNACKBAR.SUCCESS);
            });
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.leadsDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.leadsDataSource.data.forEach(row => this.selection.select(row));
  }

  unsub() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }

  checkboxLabel(row?: Lead): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;// row ${row.position + 1}`;
  }

  leadStatusAccessor(status) {
    switch (status) {
        case 'CONTACTED':
            return 'Contacted';
        case 'ACCEPTED':
            return 'Accepted';
        case 'REJECTED':
            return 'Rejected';
        case 'LEAD':
            return 'Lead';
        default:
            return 'No status';
    }
  }

  // parseClient(lead: Lead) {
  //   let clientResult = 'N/A';
  //   if (lead.client && lead.client.length) {
  //     // tslint:disable-next-line:prefer-for-of
  //     for (let i = 0; i < lead.client.length; i++) {
  //       if (clientResult === 'N/A') {
  //         clientResult = '';
  //       }
  //       clientResult += lead.client[i].name;
  //       if (i < lead.client.length - 1) {
  //         clientResult = ', ';
  //       }
  //     }
  //   }
  //
  //   return clientResult;
  // }

  handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  applyFilter(filterValue: string) {
    this.leadsDataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll() {
    this.mainSpinner = true;
    const obsFn = this.trashed ? this.leadService.getTrashed() : this.leadService.getLeads();
    // this.leadService.getLeads().subscribe(result => {
    obsFn.subscribe(result => {
      this.displayLeads(result.data);
      catchError(this.handleError);
      // this.leadsDataSource.filterPredicate = (data, filter: string)  => {
      //   const accumulator = (currentTerm, key) => {
      //     return key === 'client' ? currentTerm + data.orderInfo.type : currentTerm + data[key];
      //   };
      //   const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      //   // Transform the filter by converting it to lowercase and removing whitespace.
      //   const transformedFilter = filter.trim().toLowerCase();
      //   return dataStr.indexOf(transformedFilter) !== -1;
      // };

    });
  }

  displayLeads(leads: Lead[]) {
    this.leads = leads;
    console.log('leads: ', this.leads);
    this.leads.forEach(lead => {
      lead.parsedClients = this.leadService.parseClient(lead);
    });
    this.leadsDataSource.data = this.leads;
    this.leadsDataSource.sort = this.sort;
    this.mainSpinner = false;
    this.changeDetectorRef.detectChanges();
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
              this.snackbarService.openSnackbar('Prospect deleted.', SNACKBAR.DANGER);
              break;
            }
          }
        });
      }
    });
  }

  splitReturnFirst(s: string, delim: string = ' ') {
    if (!s) {
      return '';
    }

    return s.split(delim)[0];
  }

  restoreLead(lead: Lead) {
    this.leadService.restore(lead).subscribe(data => {
      this.leads.splice(this.leads.findIndex(l => l === lead), 1);
      this.leadsDataSource.data = this.leads;
      this.leadsDataSource.sort = this.sort;
      this.changeDetectorRef.detectChanges();
      this.snackbarService.openSnackbar('Prospect restored.', SNACKBAR.SUCCESS);
    });
  }

  shred(lead: Lead) {
    this.leadService.shredLead(lead).subscribe(data => {
      this.leads.splice(this.leads.findIndex(l => l === lead), 1);
      this.leadsDataSource.data = this.leads;
      this.leadsDataSource.sort = this.sort;
      this.changeDetectorRef.detectChanges();
      this.snackbarService.openSnackbar('Prospect deleted permanently.', SNACKBAR.DANGER);
    });
  }

  openCSVDialog() {
    this.dialogUnsub();
    const dialogRef = this.dialog.open(LeadsCsvComponent, {
      width: '60%'
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      console.log('CSV result: ', result);
      if (result) {
        if (result.CSVFile) {
          let CSVUpload: Observable<any>;
          if (result.clientId) {
            CSVUpload = this.leadService.sendCSVLeads(result.CSVFile.files[0], result.clientId);
          } else {
            CSVUpload = this.leadService.sendCSVLeads(result.CSVFile.files[0]);
          }

          this.CSVUploadSub = CSVUpload.subscribe(resp => {
            console.log(resp);
            if (resp && resp.data) {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < resp.data.length; i++) {
                this.leads[this.leads.length] = resp.data[i];
              }
              this.leadsDataSource.data = this.leads;
              this.leadsDataSource.sort = this.sort;
            }
          });
        }
      }
    });
  }

  // openLeadsByClient() {
  //   this.dialogUnsub();
  //   const dialogRef = this.dialog.open(LeadsByClientComponent, {
  //
  //   });
  //
  //   this.dialogSub = dialogRef.afterClosed().subscribe(result => {
  //
  //   });
  //
  // }

  isLead(data) {
    if ((data && typeof data === 'object') &&
      (data.created_at && data.updated_at)) {
      return true;
    }

    return false;
  }

  ellipses(s: string) {
    if (s && s.length > 50) {
      return s.substr(0, 40) + '...';
    }
  }

  dialogUnsub(): void {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.dialogUnsub();
    if (this.CSVUploadSub) {
      this.CSVUploadSub.unsubscribe();
    }
  }

}
