import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Class } from '../model/Class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http: HttpClient) { }

  createClass(fitnessclass: Class) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('id', fitnessclass.id.toString());
    body.set('participants', fitnessclass.participants.toString());
    body.set('start', fitnessclass.start.toString());
    body.set('duration', fitnessclass.duration.toString());
    body.set('maxPeople', fitnessclass.maxPeople.toString());
    body.set('description', fitnessclass.description);
    body.set('type', fitnessclass.type);
    body.set('difficulty', fitnessclass.difficulty);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/app/createClass', body, { headers: headers });

  }

  getAll() {
    return this.http.get<Class[]>('http://localhost:5000/app/getAllClasses', { withCredentials: true });
  }

  deleteAll(){
    return this.http.post<string>('http://localhost:5000/app/deleteAllClasses', {});
  }

  deleteClass(id: number){
    const body = new URLSearchParams();
    body.set('id', id.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/app/deleteClass', body, { headers: headers});

  }

  subscribeToClass(id: number, email: string){
    const body = new URLSearchParams();
    body.set('id', id.toString());
    body.set('email', email);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/app/subscribeToClass', body, { headers: headers, responseType: 'text' });

  }

  unsubscribe(id: number, email: string){
    const body = new URLSearchParams();
    body.set('id', id.toString());
    body.set('email', email);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/app/unsubscribe', body, { headers: headers, responseType: 'text' });

  }


}