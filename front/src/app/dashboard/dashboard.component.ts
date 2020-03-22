import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) { }

  // url = '127.0.0.1:8000/';
  clients: any;

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/clients').subscribe(clients => {
      // console.log('url: ', this.url + 'clients');
      console.log('vo http callback');
      this.clients = clients;
      console.log(clients);
    });
  }

}
