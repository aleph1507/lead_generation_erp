import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ClientService} from '../services/client.service';
import {Client} from '../models/Client';

class Industry {
  name: string;
  // $table->enum('status', ['NOTCONTACTED', 'NEUTRAL', 'POSITIVE', 'NEGATIVE'])
  count = {
    NOTCONTACTED: 0,
    NEUTRAL: 0,
    POSITIVE: 0,
    NEGATIVE: 0
  };
}

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.less']
})
export class ClientsViewComponent implements OnInit, OnDestroy {

  uuid: string;
  routeSub: Subscription;
  client: Client;
  industries: Industry[];

  constructor(
      private route: ActivatedRoute,
      private clientService: ClientService) { }

  parseIndustries() {
    console.log('parseIndustries');
    if (this.client.leads) {
      this.client.leads.forEach(lead => {
          console.log('lead: ', lead);
      });
    }
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      this.clientService.getClientPublic(this.uuid)
          .subscribe(dataClient => {
            this.client = dataClient.data;
            this.parseIndustries();
          });
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
