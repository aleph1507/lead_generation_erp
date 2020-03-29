import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import {AuthService} from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('jwt interceptor');
    // add authorization header with jwt token if available
    // const currentUser = this.authService.getUser();
    // console.log('currentUser:', currentUser);
    // console.log('currentUser.token:', currentUser.token);
    // if (currentUser && currentUser.token) {
    if (this.authService.loggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`
        },
        // body: {...request.body, XDEBUG_SESSION_START: }
      });
    }
      // if (request.body instanceof FormData) {
      //   if (this.authService.loggedIn) {
      //     request =  request.clone({
      //       setHeaders: {
      //         Authorization: `Bearer ${this.authService.getToken()}`
      //       },
      //       body: request.body.append('XDEBUG_SESSION_START', 'PHPSTORM')
      //     });
      //   } else {
      //     request =  request.clone({
      //       body: request.body.append('XDEBUG_SESSION_START', 'PHPSTORM')
      //     });
      //   }
      // } else {
      //   if (this.authService.loggedIn) {
      //     request =  request.clone({
      //       setHeaders: {
      //         Authorization: `Bearer ${this.authService.getToken()}`
      //       },
      //       body: {...request.body, XDEBUG_SESSION_START: 'PHPSTORM'}
      //     });
      //   } else {
      //     request =  request.clone({
      //       body: {...request.body, XDEBUG_SESSION_START: 'PHPSTORM'}
      //     });
      //   }
      // }
    // }

      return next.handle(request);
  }
}
