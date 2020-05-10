import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from "rxjs";
import {ClientService} from "../services/client.service";

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.less']
})
export class ClientsViewComponent implements OnInit, OnDestroy {

  uuid: string;
  routeSub: Subscription;

  constructor(
      private route: ActivatedRoute,
      private clientService: ClientService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      this.clientService.getClientPublic(this.uuid)
          .subscribe(dataClient => {
            console.log(dataClient);
          });
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
