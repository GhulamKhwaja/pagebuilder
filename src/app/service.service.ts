import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) {}
  private subjectName = new Subject<any>(); //need to create a subject

  sendUpdate(message: string) {
    //the component that wants to update something, calls this fn
    this.subjectName.next({ text: message }); //next() will feed the value in Subject
  }

  getUpdate(): Observable<any> {
    //the receiver component calls this function
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  public selectValuesAfterSpace(val) {
    let regex = /\s(.*)/;
    let result = val.match(regex);
    return result;
  }

  createNE(url, obj) {
    return this.http.post(url, obj);
  }
}
