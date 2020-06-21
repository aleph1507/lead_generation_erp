import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClientService} from '../services/client.service';
import {Client} from '../models/Client';
import {catchError} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {SingleClientComponent} from '../dialogs/single-client/single-client.component';
import {DeleteClientComponent} from '../dialogs/single-client/delete-client/delete-client.component';
import {SnackbarService} from '../services/snackbar.service';
import {SNACKBAR} from '../enums/snackbar.enum';
import {ClientLeadsComponent} from '../dialogs/client-leads/client-leads.component';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less']
})
export class ClientsComponent implements OnInit, OnDestroy {
  @Input() trashed = false;

  private clients: Client[] = [];
  private clientsDataSource = new MatTableDataSource(this.clients);
  private dialogSub: Subscription = null;
  private noProspectsMsg = 'No Prospects';
  private elevateClass: boolean[] = [];
  private hovering = false;
  private columns = [];
  private mainSpinner = true;
  // private client: Client = null;
  // private snackBarRef = null;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumnsLimited = ['name', 'description', 'no_leads', 'created_at', 'updated_at'];

  displayedColumns = ['edit', 'delete', 'name', 'description', 'no_leads', 'created_at', 'updated_at'];

  displayedColumnsTrashed = ['restore', 'shred', 'name', 'description', 'no_leads', 'created_at', 'updated_at',
    'deleted_at'];

  constructor(
    private clientsService: ClientService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
   this.columns = this.authService.isAdmin() ?
       (this.trashed ? this.displayedColumnsTrashed : this.displayedColumns) : this.displayedColumnsLimited;
   // this.columns = this.trashed ? this.displayedColumnsTrashed : this.displayedColumns :

   this.getAll();
  }

  handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

  applyFilter(filterValue: string) {
    this.clientsDataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll() {
    this.mainSpinner = true;
    const obsFn = this.trashed ? this.clientsService.getTrashed() : this.clientsService.getClients();
    // this.clientsService.getClients().subscribe(result => {
    obsFn.subscribe(result => {
      this.clients = result.data;
      catchError(this.handleError);
      this.clientsDataSource.data = this.clients;
      this.clientsDataSource.sort = this.sort;
      this.mainSpinner = false;
    });
  }

  openDialog($event: Event, client: Client = null) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(SingleClientComponent, {
      height: '60%',
      width: '80%',
      data: {
        client
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        if (client !== null) {
          if (result.data.success) {
            this.getAll();
            this.snackbarService.openSnackbar('Client ' + client.name + ' edited.');
          } else {
            this.snackbarService.openSnackbar('There has been a problem editing client. ' + client.name, SNACKBAR.DANGER);
          }
        }

        if (client === null) {
          if (this.isClient(result.data)) {
            this.clients[this.clients.length] = result.data;
            this.clientsDataSource.data = this.clients;
            this.clientsDataSource.sort = this.sort;
            this.snackbarService.openSnackbar('Client ' + result.data.name + ' added.', SNACKBAR.SUCCESS);
          } else {
            this.snackbarService.openSnackbar('There has been a problem adding the client.', SNACKBAR.DANGER);
          }
        }
      }
    });
  }

  deleteDialog($event: Event, client: Client) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteClientComponent, {
      width: '60%',
      data: {
        client
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientsService.deleteClient(client.id).subscribe(deletionResult => {
          const deletedClientName = deletionResult.data.name;
          for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === deletionResult.data.id) {
              this.clients.splice(i, 1);
              this.clientsDataSource.data = this.clients;
              this.clientsDataSource.sort = this.sort;
              this.snackbarService.openSnackbar('Client ' + deletedClientName + ' deleted.', SNACKBAR.DANGER);
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

  openLeadsDialog(event: Event, client: Client) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ClientLeadsComponent, {
      // width: '60%',
      data: {
        client
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      this.getAll();
      // console.log('dialog closing');
      // if (result) {
      //   console.log('DialogLeadsResult: ', result);
      // }
    });
  }

  // tslint:disable-next-line:variable-name
  // displayNoLists(no_leads) {
  //   if (Number.isInteger(no_leads) && no_leads > 0) {
  //     return no_leads;
  //   }
  //
  //   return this.noProspectsMsg;
  // }

  displayNoLists(client: Client) {
    if (Number.isInteger(client.no_leads) && client.no_leads > 0) {
      return client.no_leads;
    }

    return this.noProspectsMsg;
  }

  dialogUnsub(): void {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.dialogUnsub();
  }

  isClient(data) {
    if ((data && typeof data === 'object') &&
      (data.created_at && data.updated_at) &&
      data.name) {
      return true;
    }

    return false;
  }

  navigateTo(row) {
    console.log(row);
  }

  restoreClient($event: Event, client: Client) {
    $event.stopPropagation();
    this.clientsService.restore(client).subscribe(data => {
      this.clients.splice(this.clients.findIndex(c => c === client), 1);
      this.clientsDataSource.data = this.clients;
      this.clientsDataSource.sort = this.sort;
      this.changeDetectorRef.detectChanges();
      this.snackbarService.openSnackbar('Client restored.', SNACKBAR.SUCCESS);
    });
  }

  shred($event: Event, client: Client) {
    $event.stopPropagation();
    this.clientsService.shredLead(client).subscribe(data => {
      this.clients.splice(this.clients.findIndex(c => c === client), 1);
      this.clientsDataSource.data = this.clients;
      this.changeDetectorRef.detectChanges();
      this.snackbarService.openSnackbar('Client deleted permanently.', SNACKBAR.DANGER);
    });
  }

}
