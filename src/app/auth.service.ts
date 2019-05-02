import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './authUser';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /* userID used for post/comment creates, potentially profile/post/comment edits or stored 
  locally for session persistance*/
  private currentUser: User;

  // updates logged in status
  private _loggedIn: BehaviorSubject<boolean>;

  // change to host ip
  apiUrl = environment.url;

  constructor(private http: HttpClient) {
    // session storage for session persistance, update to JWT
    const session = JSON.parse(sessionStorage.getItem('user'));

    if (session) {
      this.currentUser = session;
      this._loggedIn = new BehaviorSubject<boolean>(true);
    } else if (!session) {
      this._loggedIn = new BehaviorSubject<boolean>(false);
    }
  }

  httpOptions = {
    // required to persist session info on requests after login
    withCredentials: true
  };

  // emits current logged in status and future changes to status
  get loggedIn() {
    return this._loggedIn.asObservable();
  }

  getUserId() {
    if (!this.currentUser) {
      return null;
    }
    return this.currentUser.id;
  }

  // register user
  registerUser(user, cb) {
    return this.http.post(this.apiUrl + '/api/signup', user, this.httpOptions)
      .subscribe((resp) => {
        if (resp['user']) {
          this.currentUser = resp['user'];
          sessionStorage.setItem('user', JSON.stringify(this.currentUser));
          this._loggedIn.next(true);
        }
        cb(resp['message']);
      }, (err) => {
        cb(err);
      });
  }

  // login user
  login(user, cb) {
    this.http.post(this.apiUrl + '/api/login', user, this.httpOptions)
      .subscribe((resp) => {
        if (resp['user']) {
          this.currentUser = resp['user'];
          sessionStorage.setItem('user', JSON.stringify(this.currentUser));
          this._loggedIn.next(true);
        }
        cb(resp['message']);
      }, (err) => {
        cb(err);
      });
  }

  // logout user
  logout(cb) {
    this.http.get(this.apiUrl + '/api/logout', this.httpOptions)
      .subscribe((resp) => {
        this.currentUser = undefined;
        sessionStorage.clear();
        this._loggedIn.next(false);
        cb(resp, null);
      }, (err) => {
        cb(null, err);
      });
  }
}
