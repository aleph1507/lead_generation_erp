import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SnackbarService} from '../../services/snackbar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  public LOGO = 'assets/img/asec-logo.png';
  private initRegCheck: boolean;
  private initReg: boolean;
  private registered = false;

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.init_reg().subscribe(ir => {
      this.initRegCheck = true;
      this.initReg = ir.init_reg;

      if (!this.initReg) {
        if (!this.authService.isAdmin()) {
          this.router.navigate(['/login']);
        }
      }

      this.registerForm = this.createRegisterForm();
    });

  }

  createRegisterForm() {
    return new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change'
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'change'
      }),
      password_confirmation: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)]
      }),
      administrator: new FormControl({value: this.initReg, disabled: this.initReg}),
    }, {
      // validator: this.mustMatch('password', 'password_confirmation')
      // validator: CustomValidators.mustMatch('password', 'password_confirmation')
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  register() {
    // this.mustMatch(this.registerForm.controls.password, this.registerForm.controls.password_confirmation);
    if (this.registerForm.controls.password.value !== this.registerForm.controls.password_confirmation.value) {
      this.registerForm.controls.password_confirmation.setErrors({mustMatch: true});
    }

    if (this.registerForm.invalid) {
      return -1;
    }

    this.authService.register(this.registerForm.controls.name.value,
      this.registerForm.controls.email.value, this.registerForm.controls.password.value,
      this.registerForm.controls.administrator.value, this.initReg)
        .subscribe(
          user => {
              catchError(this.handleError);
              this.snackbarService.openSnackbar('User ' + this.registerForm.controls.name.value + ' registered.');
              console.log('user:', user);
              this.registerForm = this.createRegisterForm();
              this.registered = true;
              if (this.initRegCheck && this.initReg) {
                this.router.navigate(['/login']);
              }
          },
          (error) => {
            this.snackbarService.openSnackbar('There has been an error.');
            this.handleError(error);
          });
  }

  handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

}
