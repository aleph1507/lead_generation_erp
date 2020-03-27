import {Component, Inject, OnInit} from '@angular/core';
import {Client} from '../../models/Client';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {SnackbarService} from '../../services/snackbar.service';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {matchingPasswords} from "../../utils/CustomValidators";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<ChangePasswordComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {client: Client},
      private authService: AuthService,
      private snackbarService: SnackbarService,
  ) { }

  changePasswordForm: FormGroup;

    matchValues(
        matchTo: string // name of the control to match to
    ): (AbstractControl) => ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            return !!control.parent &&
            !!control.parent.value &&
            control.value === control.parent.controls[matchTo].value
                ? null
                : { isMatching: false };
        };
    }

  ngOnInit() {
  }

  createChangePasswordForm() {
    return this.authService.isAdmin() ?
        new FormGroup({
          newPassword: new FormControl( null, { }),
          newPasswordConfirmation: new FormControl( null, { }),
        }) :
        new FormGroup({
          oldPassword: new FormControl(null, { }),
          newPassword: new FormControl( null, { }),
          newPasswordConfirmation: new FormControl( null, { }),
        }, matchingPasswords('newPassword', 'newPasswordConfirmation'));
  }
}
