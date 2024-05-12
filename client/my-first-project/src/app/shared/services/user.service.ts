import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>('http://localhost:5000/app/getAllUsers', {withCredentials: true});
  }

  isAdmin(email: string) {
    const body = new URLSearchParams();
    body.set('email', email);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/app/isAdmin', body, { headers: headers, responseType: 'text' })

  }
  
  makeAdmin(isAdmin: boolean, email: string){
    const body = new URLSearchParams();
    body.set('isAdmin', isAdmin.toString());
    body.set('email', email);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/app/makeAdmin', body, { headers: headers, responseType: 'text' })

  }

  deleteUser(email: string){
    const body = new URLSearchParams();
    body.set('email', email);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/app/deleteUser', body, { headers: headers})

  }

}
