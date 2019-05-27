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
  private loggedInSubject = new BehaviorSubject<boolean>(false);

  // change to host ip
  apiUrl = environment.url;

  /* alternatively standardise responses and assign interface to allow dot notation access
  |* to the response properties */
  /* tslint:disable: no-string-literal */

  constructor(private http: HttpClient) {
    // retrieve previously stored user or null if none exists
    const stored: string = sessionStorage.getItem('user');

    let session: User;
    // if stored not null then try parse stored string into User object
    if (stored) {
      try {
        session = JSON.parse(stored);
      } catch (e) {
        // catch parse errors, clear sessionStorage if parse throws error
        console.error(e.toString());
        sessionStorage.clear();
      }
    }
    if (session) {
      const sub = this.http.post(this.apiUrl + '/api/test', {id: session.id})
        .subscribe((resp) => {
          sub.unsubscribe();
          this.currentUser = session;
          this.loggedInSubject = new BehaviorSubject<boolean>(true);
        }, (err) => {
          sub.unsubscribe();
          sessionStorage.clear();
        });
    }
  }

  httpOptions = {
    // required to persist session info on requests after login
    withCredentials: true
  };

  // emits current logged in status and future changes to status
  get loggedIn() {
    return this.loggedInSubject.asObservable();
  }

  getUserId() {
    if (!this.currentUser) {
      return null;
    }
    return this.currentUser.id;
  }

  // register user
  registerUser(user) {
    return new Promise((resolve, reject) => {
      const sub = this.http.post(this.apiUrl + '/api/signup', user, this.httpOptions)
        .subscribe((resp) => {
          if (resp['user']) {
            this.currentUser = resp['user'];
            sessionStorage.setItem('user', JSON.stringify(this.currentUser));
            this.loggedInSubject.next(true);
          }
          sub.unsubscribe();
          resolve(resp['message']);
        }, (err) => {
          sub.unsubscribe();
          reject(err);
        });
    });
  }

  // login user
  login(user) {
    return new Promise((resolve, reject) => {
      const sub = this.http.post(this.apiUrl + '/api/login', user, this.httpOptions)
        .subscribe((resp) => {
          if (resp['user']) {
            this.currentUser = resp['user'];
            sessionStorage.setItem('user', JSON.stringify(this.currentUser));
            this.loggedInSubject.next(true);
          }
          sub.unsubscribe();
          resolve(resp['message']);
        }, (err) => {
          sub.unsubscribe();
          reject(err);
        });
    });
  }

  // logout user
  logout() {
    return new Promise((resolve, reject) => {
      const sub = this.http.get(this.apiUrl + '/api/logout', this.httpOptions)
        .subscribe((resp) => {
          this.currentUser = undefined;
          sessionStorage.clear();
          this.loggedInSubject.next(false);
          sub.unsubscribe();
          resolve(resp);
        }, (err) => {
          sub.unsubscribe();
          reject(err);
        });
    });
  }
  /* tslint:enable:no-string-literal */
}
