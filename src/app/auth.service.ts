import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './authUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User;

  apiUrl = 'http://localhost:1337';

  constructor(private http: HttpClient) { }

  httpOptions = {
    withCredentials: true
   };

  getUserId() {
    if (!this.currentUser) {
      return null;
    }
    return this.currentUser.id;
  }

  registerUser(user) {
    return this.http.post(this.apiUrl + '/signup', user, this.httpOptions);
  }

  login(user, cb) {
    this.http.post(this.apiUrl + '/login', user, this.httpOptions)
      .subscribe((resp) => {
        this.currentUser = resp['data'];
        //add error checking
        cb(resp['message']);
      });
  }
}
