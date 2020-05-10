import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime, finalize, switchMap, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ClientService} from '../services/client.service';
import {Client} from '../models/Client';
import {Router} from '@angular/router';

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

  constructor(
      private router: Router
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

}
