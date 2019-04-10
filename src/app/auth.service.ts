import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: String = 'http://localhost:1337';

  constructor(private http: HttpClient) { }

  httpOptions = {
    withCredentials: true
   };

  registerUser(user) {
    return this.http.post(this.apiUrl + '/signup', user, this.httpOptions);
  }

  login(user) {
    return this.http.post(this.apiUrl + '/login', user, this.httpOptions);
  }
}
