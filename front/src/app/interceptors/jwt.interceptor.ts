import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import {AuthService} from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('jwt interceptor');
    // add authorization header with jwt token if available
    // const currentUser = this.authService.getUser();
    // console.log('currentUser:', currentUser);
    // console.log('currentUser.token:', currentUser.token);
    // if (currentUser && currentUser.token) {
    if (this.authService.loggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
