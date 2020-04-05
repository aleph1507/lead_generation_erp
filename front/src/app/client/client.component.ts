import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../models/Client';
import {ClientService} from '../services/client.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SnackbarService} from '../services/snackbar.service';
import {Subscription} from 'rxjs';
import {Lead} from '../models/Lead';
import {ApprovalRequestsComponent} from '../dialogs/approval-requests/approval-requests.component';
import {MatDialog} from '@angular/material';
import {SingleLeadComponent} from '../dialogs/single-lead/single-lead.component';
import {SNACKBAR} from '../enums/snackbar.enum';
import {DeleteLeadComponent} from '../dialogs/single-lead/delete-lead/delete-lead.component';
import {LeadService} from '../services/lead.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.less']
})
export class ClientComponent implements OnInit, OnDestroy {

  client: Client;
  clientForm: FormGroup;
  leadData: any;
  paramsSubscription: Subscription;
  clientSubscription: Subscription;
  leadsBD: any;
  dialogSub: Subscription;
  clientId: number;
  isAdmin: boolean;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private leadService: LeadService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('client'), 10);
      if (id) {
        this.clientId = id;
        this.getClient(id);
      }
    });

    this.authService.userSubject.asObservable().subscribe(user => {
      this.isAdmin = user && user.admin;
    });
  }

  getClient(id: number = -1) {
    if (this.clientId && id === -1) {
      id = this.clientId;
    }
    this.clientService.getClient(id).subscribe(data => {
      this.client = data.data;
      this.clientForm = this.createClientForm();
      this.clientService.getClientLeadsByDate(this.client).subscribe(leadsByDate => {
        // this.leadsBD = leadsByDate;
        this.leadsBD = {};
        Object.keys(leadsByDate).sort((d1, d2) => {
          console.log((d2 +  ' ' + d1 + ' = ' + ((new Date(d2) as any) - (new Date(d1) as any))));
          return ((new Date(d2) as any) - (new Date(d1) as any));
          // console.log(new Date(d1) + ' < ' + new Date(d2) + ' = ' + (new Date(d1) < new Date(d2)));
          // return (new Date(d1) < new Date(d2)) ? -1 : 1;
        }).forEach(key => {
          this.leadsBD[key] = leadsByDate[key];
          console.log('this.leadsBD', this.leadsBD);
        });
        // this.leadsBD = Object.keys(leadsByDate).reverse();
        // console.log('this.leadsBD', this.leadsBD);
      });
      // id: 1
      // name: "musala"
      // description: "musala"
      // no_leads: 3
      // created_at: "2020-02-17"
      // updated_at: "2020-02-17"
    });
  }

  asInOrder(a, b) {
    return 1;
  }

  openARDialog(client, lead, chats, getAR, loadControls) {
    const dialogRef = this.dialog.open(ApprovalRequestsComponent, {
      data: {
        client,
        lead,
        chats,
        getAR,
        loadControls
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      console.log('result:', result);
    });
  }

  openEditLeadDialog(lead: Lead = null) {
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
      }
    });
  }

  deleteLead(lead: Lead) {
    this.leadService.deleteLead(lead.id).subscribe(deletionResult => {
      this.snackbarService.openSnackbar('Lead deleted.', SNACKBAR.DANGER);
      this.getClient();
    });
  }

  deleteLeadDialog(lead: Lead) {
    const dialogRef = this.dialog.open(DeleteLeadComponent, {
      width: '60%',
      data: {
        lead
      }
    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteLead(lead);
      }
    });
  }

  dateKey(d) {
    const date = new Date(d);
    return date;
  }

  save() {
    if (this.clientForm.controls) {
      if (this.clientForm.controls.name &&
        this.clientForm.controls.name.value) {

        this.client.name = this.clientForm.controls.name.value;
      }

      if (this.clientForm.controls.description) {
        this.client.description = this.clientForm.controls.description.value;
      }

      if (this.clientForm.controls.csv_file &&
        this.clientForm.controls.csv_file.value &&
        this.clientForm.controls.csv_file.value.files &&
        this.clientForm.controls.csv_file.value.files[0]) {

        this.client.csv_file = this.clientForm.controls.csv_file.value.files[0];
      }

    }

    if (this.clientForm.valid) {
      this.clientService.updateClient(this.client).subscribe(result => {
        this.snackbarService.openSnackbar('Client ' + this.client.name + ' saved.');
        this.getClient();
      });
    }

  }

  backToClients() {
    this.router.navigate(['../clients']);
  }

  createClientForm() {
    return new FormGroup({
      name: new FormControl(this.client.name, {
        validators: [Validators.required]
      }),
      description: new FormControl(this.client.description, { }),
      csv_file: new FormControl(null, { })
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
  }

}


