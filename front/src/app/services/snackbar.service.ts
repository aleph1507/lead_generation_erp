import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {SNACKBAR} from '../enums/snackbar.enum';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private snackbarRef = null;

  constructor(
    private snackbar: MatSnackBar
  ) { }

  openSnackbar(message,
               type: SNACKBAR = SNACKBAR.SUCCESS,
               duration = 3000,
               action = null) {

    let classes = '';

    if (type === SNACKBAR.SUCCESS) {
      classes = 'notif-success';
    }

    if (type === SNACKBAR.DANGER) {
      classes = 'notif-danger';
    }

    this.snackbar.open(message, action, {
      duration,
      verticalPosition: 'top',
      panelClass: classes
    });
  }
}
