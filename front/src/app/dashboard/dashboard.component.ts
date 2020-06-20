import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subscription} from "rxjs";
import {User} from "../models/User";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  loggedIn: boolean;
  loggedInSub: Subscription;
  user: User;
  isAdmin = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedInSub = this.authService.loggedInStatus().subscribe(loggedIn => {
      console.log('AppComponent this.authService.loggedInStatus() loggedIn:' + loggedIn);
      this.loggedIn = loggedIn;
    });
    this.authService.userSubject.asObservable().subscribe(user => {
      this.user = user;
      this.isAdmin = this.user && this.user.admin;
    });
    // this.admin = this.authService.isAdmin();
    // this.loggedInSub = this.authService.loggedInStatus().subscribe(loggedIn => this.loggedIn = loggedIn);
  }

  // url = '127.0.0.1:8000/';
  // clients: any;
  //
  // ngOnInit() {
  //   this.http.get('http://127.0.0.1:8000/api/clients').subscribe(clients => {
  //     // console.log('url: ', this.url + 'clients');
  //     console.log('vo http callback');
  //     this.clients = clients;
  //     console.log(clients);
  //   });
  // }

}
