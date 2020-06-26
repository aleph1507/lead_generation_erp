import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Lead} from '../../models/Lead';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LeadService} from '../../services/lead.service';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {ClientService} from '../../services/client.service';
import {Client} from '../../models/Client';
import {MatSelect} from '@angular/material/select';

import {ChatsComponent} from '../../chats/chats.component';
// import {LeadStatusAssociative} from '../../utils/LeadStatusAssociative';



@Component({
  selector: 'app-single-lead',
  templateUrl: './single-lead.component.html',
  styleUrls: ['./single-lead.component.less']
})
export class SingleLeadComponent implements OnInit {

  leadForm: FormGroup;
  lead: Lead;
  clients: any;
  isLoading: boolean;
  // tslint:disable-next-line:variable-name
  client_id = new FormControl();

  leadStatusAssociative = {
    CONTACTED: 'Contacted',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    LEAD: 'Lead'
  };

  // case 'NOTCONTACTED':
//             return 'Not Yet Contacted';
//         case 'NEUTRAL':
//             return 'In progress';
//         case 'POSITIVE':
//             return 'Lead';
//         case 'NEGATIVE':
//             return 'Not Interested';
//         default:
//             return 'No status';

  constructor(
    public dialogRef: MatDialogRef<SingleLeadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leadService: LeadService,
    private clientsService: ClientService
  ) { }

  ngOnInit() {
    this.lead = this.data ? (this.data.lead ? this.data.lead : new Lead()) : new Lead();
    console.log('this.lead: ', this.lead);
    this.leadForm = this.createLeadForm();
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

  save() {
    this.lead.duxid = this.leadForm.controls.duxid.value;
    if (this.leadForm.controls.client_id.value) {
      this.lead.attach = JSON.stringify({clients: [this.leadForm.controls.client_id.value.id]});
    }
    this.lead.visitTime = this.leadForm.controls.visitTime.value;
    this.lead.profile = this.leadForm.controls.profile.value;
    this.lead.picture = this.leadForm.controls.picture.value;
    this.lead.degree = this.leadForm.controls.degree.value;
    this.lead.firstName = this.leadForm.controls.firstName.value;
    this.lead.middleName = this.leadForm.controls.middleName.value;
    this.lead.lastName = this.leadForm.controls.lastName.value;
    this.lead.summary = this.leadForm.controls.summary.value;
    this.lead.title = this.leadForm.controls.title.value;
    this.lead.from = this.leadForm.controls.from.value;
    this.lead.company = this.leadForm.controls.company.value;
    this.lead.companyProfile = this.leadForm.controls.companyProfile.value;
    this.lead.companyWebsite = this.leadForm.controls.companyWebsite.value;
    this.lead.personalWebsite = this.leadForm.controls.personalWebsite.value;
    this.lead.email = this.leadForm.controls.email.value;
    this.lead.phone = this.leadForm.controls.phone.value;

    if (this.data && this.data.lead) {
      if (this.leadForm.valid) {
        this.leadService.updateLead(this.lead).subscribe(result => {
          this.dialogRef.close(result);
        });
      }
    } else {
      if (this.leadForm.valid) {
        this.leadService.storeLead(this.lead).subscribe(result => {
          this.dialogRef.close(result);
        });
      }
    }
  }

  displayFn(client?: Client): string | undefined {
    return client ? client.name : undefined;
  }

  close() {
    this.dialogRef.close(this.data);
  }

  createLeadForm() {
    return new FormGroup({
      duxid: new FormControl(this.lead.duxid),
      client_id: this.client_id,
      status: new FormControl(this.lead.status),
      visitTime: new FormControl(this.lead.visitTime),
      profile: new FormControl(this.lead.profile),
      picture: new FormControl(this.lead.picture),
      degree: new FormControl(this.lead.degree),
      firstName: new FormControl(this.lead.firstName),
      middleName: new FormControl(this.lead.middleName),
      lastName: new FormControl(this.lead.lastName),
      summary: new FormControl(this.lead.summary),
      title: new FormControl(this.lead.title),
      from: new FormControl(this.lead.from),
      company: new FormControl(this.lead.company),
      companyProfile: new FormControl(this.lead.companyProfile),
      companyWebsite: new FormControl(this.lead.companyWebsite),
      personalWebsite: new FormControl(this.lead.personalWebsite),
      email: new FormControl(this.lead.email),
      phone: new FormControl(this.lead.phone)
    });
  }

}
