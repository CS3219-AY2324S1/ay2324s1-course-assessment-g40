import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.BACKEND_API + 'auth/';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      API_URL + 'signin',
      { username, password }, httpOptions
    );
  }

  signout(): Observable<any> {
    return this.http.post(
      API_URL + 'signout',
      {}, httpOptions
    );
  }
}
