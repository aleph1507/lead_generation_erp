import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerFirst: boolean;

  constructor(
    private authService: AuthService,
    private router: Router) { }
  // private LOGO = require('../img/asec-logo.png');
  public LOGO = 'assets/img/asec-logo.png';
  // public LOGO = 'assets/img/Lead-Generation.png';

  logIn() {
    this.authService.logIn(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
  }

  ngOnInit() {
    this.authService.init_reg().subscribe(ir => {
      this.registerFirst = ir.init_reg;
      catchError(this.handleError);
    });

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'change'
      }),
      password: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      })
    });
  }

  initReg() {
    this.router.navigate(['/register']);
  }

  handleError(error: any) {
    console.log(error);
    return throwError(error);
  }

}
