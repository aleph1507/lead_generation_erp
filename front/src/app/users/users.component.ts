import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {User} from '../models/User';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {AuthService} from '../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../services/snackbar.service';
import {UserComponent} from "../dialogs/user/user.component";
import {SNACKBAR} from "../enums/snackbar.enum";
import {DeleteUserComponent} from "../dialogs/delete-user/delete-user.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {
  @Input() trashed = false;

  private users: User[] = [];
  private usersDataSource = new MatTableDataSource(this.users);
  private dialogSub: Subscription = null;

  private displayedColumns = ['name', 'email', 'admin',
    'created_at', 'updated_at', 'edit', 'delete'];
  private displayedColumnsTrashed = ['name', 'email', 'admin',
    'created_at', 'updated_at', 'deleted_at', 'restore', 'shred'];

  private columns = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
      private authService: AuthService,
      private dialog: MatDialog,
      private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.columns = this.trashed ? this.displayedColumnsTrashed : this.displayedColumns;
    this.getUsers();
  }

  getUsers() {
    this.authService.getUsers(this.trashed).subscribe(users => {
      this.users = users.data;
      this.usersDataSource = new MatTableDataSource<User>(this.users);
      this.usersDataSource.sort = this.sort;
    });
  }

  openDialog($event: Event, user: User) {
    const dialogRef = this.dialog.open(UserComponent, {
      data: {
        user
      }
    });

    this.unsub();
    this.dialogSub = dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getUsers();
        this.snackbarService.openSnackbar('User updated successfully.');
      }

      if (res === false) {
        this.snackbarService.openSnackbar('There has been a problem updating the user.', SNACKBAR.DANGER);
      }
      // if (res && res.data && res.data.success) {
      //   this.getUsers();
      //   this.snackbarService.openSnackbar('User edited successfully', SNACKBAR.SUCCESS);
      // } else {
      //   this.snackbarService.openSnackbar('There has been a problem editing the user.', SNACKBAR.DANGER);
      // }
    });
  }

  deleteDialog($event: Event, user: User) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {
        user
      }
    });

    this.unsub();
    this.dialogSub = dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.authService.deleteUser(user.id).subscribe(deletion => {
          if (deletion) {
            console.log('deletion:', deletion);
            this.getUsers();
            this.snackbarService.openSnackbar('User ' + user.name + ' deleted successfully');
          }
        }, error => {
          this.snackbarService.openSnackbar('There has been a problem deleting ' + user.name + '.', SNACKBAR.DANGER);
        });

      }
    });
  }

  unsub() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  restoreUser($event: Event, user: User) {
    $event.stopPropagation();
    this.authService.restoreUser(user.id).subscribe(u => {
      this.getUsers();
      this.snackbarService.openSnackbar('User ' + user.name + ' restored');
    });
  }

  shredUser($event: Event, user: User) {
    $event.stopPropagation();
    this.authService.shredUser(user.id).subscribe(u => {
      this.getUsers();
      this.snackbarService.openSnackbar('User ' + user.name + ' deleted permanently');
    });
  }

}
