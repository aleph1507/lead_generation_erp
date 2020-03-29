import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {SnackbarService} from '../../services/snackbar.service';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {matchingPasswords} from '../../utils/CustomValidators';
import {SNACKBAR} from '../../enums/snackbar.enum';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  userId: number;
  private hide = true;
  private hideOld = true;

  constructor(
      public dialogRef: MatDialogRef<ChangePasswordComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {userId: number},
      private authService: AuthService,
      private snackbarService: SnackbarService,
  ) { }

    matchValues(
        matchTo: string // name of the control to match to
    ): (AbstractControl) => ValidationErrors | null {
      const a = 'aaa';
      return (control: AbstractControl): ValidationErrors | null => {
            return !!control.parent &&
            !!control.parent.value &&
            control.value === control.parent.controls[matchTo].value
                ? null
                : { isMatching: false };
        };
    }

  ngOnInit() {
      this.userId = (this.data && this.data.userId) ? this.data.userId : this.authService.getUser().id;
      this.changePasswordForm = this.createChangePasswordForm();
  }

  onSubmit() {
      const oldPassword = this.changePasswordForm.controls.oldPassword ? this.changePasswordForm.controls.oldPassword.value : null;
      this.authService.changePassword(this.userId,
            this.changePasswordForm.controls.newPassword.value,
            oldPassword)
            .subscribe(success => {
                success ?
                    this.snackbarService.openSnackbar('Password changed') :
                    this.snackbarService.openSnackbar('There has been an error changing the password', SNACKBAR.DANGER);

                this.close();
        }, error => {
                this.snackbarService.openSnackbar('There has been an error', SNACKBAR.DANGER);
                console.log(error);
            });
  }

  close() {
      this.dialogRef.close();
  }

  createChangePasswordForm() {
    return this.authService.isAdmin() ?
        new FormGroup({
          newPassword: new FormControl( null, {
              validators: [Validators.required],
              updateOn: 'change'
          }),
          newPasswordConfirmation: new FormControl( null, {
              validators: [Validators.required],
              updateOn: 'change'
          }),
        }, matchingPasswords('newPassword', 'newPasswordConfirmation')) :
        new FormGroup({
          oldPassword: new FormControl(null, {
              validators: [Validators.required],
              updateOn: 'change'
          }),
          newPassword: new FormControl( null, {
              validators: [Validators.required],
              updateOn: 'change'
          }),
          newPasswordConfirmation: new FormControl( null, {
              validators: [Validators.required],
              updateOn: 'change'
          }),
        }, matchingPasswords('newPassword', 'newPasswordConfirmation'));
  }
}
