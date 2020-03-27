import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth.service';
import {User} from './models/User';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from './dialogs/change-password/change-password.component';

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

  private dialogSub: Subscription = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(ChangePasswordComponent, {

    });

    this.dialogSub = dialogRef.afterClosed().subscribe(result => {

    });
  }

  logOut() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    if (this.loggedInSub) {
      this.loggedInSub.unsubscribe();
    }

    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }
}
