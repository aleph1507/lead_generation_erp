import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {ServerConfigService} from './server-config.service';
import {ServerMessage} from '../models/ServerMessage';
import {User} from '../models/User';
import {SnackbarService} from './snackbar.service';
import {SNACKBAR} from "../enums/snackbar.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // public token: string = null;
  // public baseUrl = 'http://127.0.0.1:8000/';
  // url = this.baseUrl + '/token';
  loggedIn = false;
  public loggedStatus: BehaviorSubject<boolean>;

  public userSubject: BehaviorSubject<User>;

  private user: User;
  private token: string;

  // username = '';
  // fullname = '';
  // lastPasswordChangedDate = '';
  // passChangedDate: BehaviorSubject<string>;

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json'
  });

  setUser(user: User, accessToken: string) {
    console.log('set user:', user);
    this.user = user;
    this.setToken(accessToken);
    this.setUserLocalstorage(this.user);
    this.setLoggedInBehavior();
  }

  setToken(token: string) {
    this.token = token;
    this.setTokenLocalStorage(token);
  }

  getToken() {
    if (this.token) {
      return this.token;
    }

    return localStorage.getItem('token');
  }

  setTokenLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  getUser(): User {
    return this.user;
  }

  setActiveUserFromLocalstorage() {
    this.user = this.getUserLocalstorage();
  }

  setUserLocalstorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserLocalstorage(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  setLoggedInBehavior() {
    if (this.user) {
      this.loggedIn = true;
      this.loggedStatus.next(this.loggedIn);
      this.userSubject.next(this.user);
    }
  }

  constructor(
              private http: HttpClient,
              private router: Router,
              private serverConfigService: ServerConfigService,
              private snackbarService: SnackbarService
  ) {
    this.loggedStatus = new BehaviorSubject<boolean>(this.loggedIn);
    this.userSubject = new BehaviorSubject<User>(this.user);
    // this.passChangedDate = new BehaviorSubject<string>(this.lastPasswordChangedDate);
    this.setActiveUserFromLocalstorage();
    this.setLoggedInBehavior();
    // if (localStorage.getItem('token') != 'null') {
    //   this.loggedIn = true;
    //   this.loggedStatus.next(this.loggedIn);
    // }
  }

  loggedInStatus(): Observable<boolean> {
    return this.loggedStatus.asObservable();
  }

  // passwordStatus(): Observable<string> {
  //   return this.passChangedDate.asObservable();
  // }

  getHeaders() {
    if (this.loggedIn) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.getToken(),
        Accept: 'application/json'
      });
    } else  {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // client_id: 'AsecClient'
      });
    }
  }

  // getBaseUrl() {
  //   return this.http.get('url.conf');
  // }
  //
  // getToken() {
  //   if (!this.user) {
  //     return null;
  //   }
  //
  //   return this.user.token;
  //   // return localStorage.getItem('token');
  // }

  init_reg(): Observable<{init_reg: boolean}> {
    return this.http.post<{init_reg: boolean}>(
      this.serverConfigService.endpoints.register_first,
      new HttpParams().set('init_reg',
      String(true)));
  }

  // tslint:disable-next-line:variable-name
  register(name: string, email: string, password: string,
           admin: any = false, first = false): Observable<User | ServerMessage> {
    const url = first ? this.serverConfigService.endpoints.register_first : this.serverConfigService.endpoints.register;
    admin = admin ? '1' : '0';
    const body = new HttpParams()
      .set('name', name)
      .set('email', email)
      .set('admin', admin)
      .set('password', password);

    return this.http.post<User | ServerMessage>(url, body);
  }

  changePassword(userId: number, newPassword: string, oldPassword: string = null): Observable<boolean> {
    const fd = new FormData();
    fd.append('userId', userId.toString());
    fd.append('newPassword', newPassword);
    if (oldPassword) {
      fd.append('oldPassword', oldPassword);
    }

    return this.http.post<boolean>(this.serverConfigService.endpoints.change_password, fd);
  }

  logIn(email: string, password: string/*, gt = 'password', cid = 'AsecClient'*/) {
    const body = new HttpParams()
      // .set('grant_type', gt)
      // .set('username', username)
      .set('email', email)
      .set('password', password);
      // .set('client_id', cid);
    // localStorage.setItem('token', null);
    // localStorage.setItem('role', null);
    // localStorage.setItem('username', null);
    // localStorage.setItem('fullname', null);
    this.logOut();

    this.http.post<{user: User, accessToken: string} | ServerMessage>(this.serverConfigService.endpoints.login, body)
      .subscribe(
        loginResponse => {
          if (!(loginResponse instanceof ServerMessage)) {
            // loginResponse.user ? this.user = loginResponse.user : console.log('no user loginResponse: ', loginResponse);
            loginResponse.user ? this.setUser(loginResponse.user, loginResponse.accessToken) : console.log('no user loginResponse: ', loginResponse);
            this.router.navigate(['/']);
            // this.setLoggedInBehavior();
          }
        },
        error => {
          if (error.status === 401) {
            this.snackbarService.openSnackbar('Invalid crednetials', SNACKBAR.DANGER);
          }
            // console.log('logIn()error:', error);
        });

    // return 0;
    // this.http.post<LoginResponse>(this.url, body.toString(),
    //   { headers: this.headers }).subscribe(data => {
    //   if (data.access_token) {
    //     this.token = data.access_token;
    //     localStorage.setItem('token', this.token);
    //     if (this.token != null) {
    //       this.loggedIn = true;
    //       this.loggedStatus.next(this.loggedIn);
    //       this.getRole()
    //         .subscribe(role => {
    //           localStorage.setItem('role', role);
    //         });
    //       // this.http.get(this.baseUrl + '/api/account/user/info')
    //       //   .subscribe(data => {
    //       //     localStorage.setItem('fullname', data.fullName.toString());
    //       //     this.lastPasswordChangedDate = data.lastPasswordChangedDate;
    //       //     this.passChangedDate.next(this.lastPasswordChangedDate);
    //       //   });
    //       localStorage.setItem('email', email);
    //       this.router.navigate(['/dashboard']);
    //     }
    //
    //   } else {
    //     this.loggedIn = false;
    //     localStorage.setItem('token', null);
    //     this.token = null;
    //   }
    // });
  }

  isAdmin() {
    return this.user && this.user.admin;
  }

  // getLastPasswordChangedDate() {
  //   return this.lastPasswordChangedDate;
  // }

  // getFullname() {
  //   return localStorage.getItem('fullname');
  // }

  // getRole(): Observable<string> {
  //   localStorage.setItem('role', null);
  //   return this.http.get<string>(this.baseUrl + '/api/account/user/roles');
  // }

  // role() {
  //   return localStorage.getItem('role');
  // }

  // isAdmin() {
  //   const roles = localStorage.getItem('role');
  //   return roles != null ? (roles.indexOf('Admin') != -1 ? true : false) : false;
  // }
  //
  // isOperator() {
  //   const roles = localStorage.getItem('role');
  //   return roles != null ? (roles.indexOf('Operator') != -1 ? true : false) : false;
  // }
  //
  // isUser() {
  //   const roles = localStorage.getItem('role');
  //   return roles != null ? (roles.indexOf('User') != -1 ? true : false) : false;
  // }
  //
  // isPowerUser() {
  //   const roles = localStorage.getItem('role');
  //   return roles != null ? (roles.indexOf('PowerUser') != -1 ? true : false) : false;
  // }

  logOut() {
    // localStorage.setItem('token', null);
    // localStorage.setItem('role', null);
    // localStorage.setItem('username', null);
    // localStorage.setItem('fullname', null);
    // this.token = null;
    localStorage.setItem('user', null);
    localStorage.setItem('token', null);
    this.user = null;
    this.token = null;
    this.loggedIn = false;
    this.loggedStatus.next(this.loggedIn);
    this.userSubject.next(this.user);
    this.router.navigate(['/login']);
  }

  editUser(id: number, name: string, email: string,
           admin: any = false, password: string = null): Observable<{data: User} | ServerMessage> {
    // const userFormData = toFormData(user);
    // return this.http.post<boolean>(this.serverConfigService.endpoints.user, userFormData)

    admin = admin ? '1' : '0';
    // const body = new HttpParams()
    const body = new FormData();
    body
        .set('id', id.toString());
    body
        .set('name', name);
    body
        .set('email', email);
    body
        .set('admin', admin);
    if (password) {
      body.set('password', password);
    }

    return this.http.post<{data: User} | ServerMessage>(this.serverConfigService.endpoints.user + id + '/edit/', body);
  }

  getUsers(trashed = false): Observable<{data: User[]}> {
    const params = new HttpParams().set('trashed', String(trashed));
    return this.http.get<{data: User[]}>(this.serverConfigService.endpoints.users,
        {params});
  }

  getUserAPI(id: number): Observable<{data: User}> {
    return this.http.get<{data: User}>(this.serverConfigService.endpoints.user);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(this.serverConfigService.endpoints.user_delete + id);
  }

  shredUser(id: number): Observable<User> {
    return this.http.post<User>(this.serverConfigService.endpoints.user_shred, {id});
  }

  restoreUser(id: number): Observable<User> {
    return this.http.post<User>(this.serverConfigService.endpoints.user_restore, {id});
  }

}
