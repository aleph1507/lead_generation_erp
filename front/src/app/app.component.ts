import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth.service';
import {User} from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CRM';
  opened = false;

  loggedIn: boolean;
  loggedInSub: Subscription;
  user: User;
  isAdmin = false;

  constructor(
    private authService: AuthService
  ) {
  }

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

  changePassword() {

  }

  logOut() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    if (this.loggedInSub) {
      this.loggedInSub.unsubscribe();
    }
  }
}
