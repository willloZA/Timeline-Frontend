import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './authUser';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User;

  // use loggedIn() to determine whether modal should be fired for post and comment submits

  private _loggedIn: BehaviorSubject<boolean>;

  apiUrl = 'http://localhost:1337';

  constructor(private http: HttpClient) {
    this._loggedIn = new BehaviorSubject<boolean>(false);
  }

  httpOptions = {
    withCredentials: true
  };

  get loggedIn() {
    return this._loggedIn.asObservable();
  }

  getUserId() {
    if (!this.currentUser) {
      return null;
    }
    return this.currentUser.id;
  }

  registerUser(user, cb) {
    return this.http.post(this.apiUrl + '/signup', user, this.httpOptions)
      .subscribe((resp) => {
        if (resp['user']) {
          this.currentUser = resp['user'];
          this._loggedIn.next(true);
        }
        cb(resp['message']);
      }, (err) => {
        cb(err);
      });
  }

  login(user, cb) {
    this.http.post(this.apiUrl + '/login', user, this.httpOptions)
      .subscribe((resp) => {
        if (resp['user']) {
          this.currentUser = resp['user'];
          this._loggedIn.next(true);
        }
        cb(resp['message']);
      }, (err) => {
        cb(err);
      });
  }

  logout(cb) {
    this.http.get(this.apiUrl + '/logout', this.httpOptions)
      .subscribe((resp) => {
        this._loggedIn.next(false);
        cb(resp);
      }, (err) => {
        cb(err);
      });
  }
}
