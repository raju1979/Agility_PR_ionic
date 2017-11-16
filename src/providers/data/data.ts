import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response, Request } from '@angular/http';

import { Subject } from 'rxjs/Subject';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Storage} from '@ionic/storage';




@Injectable()
export class DataProvider {

  private userSubject = new Subject<any>();

  BASE_URL = "http://localhost:5000/api/";
  // BASE_URL = "https://103.86.177.76/agility/api/";

  constructor(private _http: Http, private _storage:Storage) {
    console.log('Hello DataProvider Provider');
  }

  loginUser(data) {
    console.log(data);
    let authenticateRequest = {
      "AuthenticateRequest":{
        "Email":data.Email,
        "Password":data.Password
      }
    }
    let body = JSON.stringify(authenticateRequest);
    console.log(body);
    let _request = new Request({
      method: "POST",
      body: body,
      // change url to "./data/data.junk" to generate an error
      url: `${this.BASE_URL}ContactManager/Authenticate`,
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    let url =  `${this.BASE_URL}ContactManager/Authenticate`;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.post(url,body,{ headers: headers }).map((res:Response) => res.json())
    .catch((error:any) => Observable.throw({status:error.status,message:error.json().Message})); 

    // return this._http.request(_request)
    // .map((res:Response) => res.json())
    // .catch((error:any) => Observable.throw({status:error.status,message:error.json().Message})); 


  };//

  quickSearchRequest(token){
    
    // let token = "1eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ikxlbm9yZSBNYXR0aGV3cyIsInVzZXJtYWlsIjoibGVub3JlbWF0dGhld3NAc2NlbnRyaWMuY29tIiwiaWF0IjoxNTEwNzMzMDAwLCJleHAiOjE1MTA3NDc0MDB9.YVZYyE78f7lcSy4HXWl6JABS0_0zDQM5RsbhsmORhZk"
    console.log(token)
    let query =  {
        "QuickSearchRequest": 
        {
          "Name": "year",
          "GeographyIDs":
          [
            {
              "type": "number"
            }
          ]
        }
      }

    var body = JSON.stringify(query);
    console.log(body);

    let _request = new Request({
        method: "POST",
        body:body,
        // change url to "./data/data.junk" to generate an error
        url: `${this.BASE_URL}ContactManager/QuickSearch`,
        headers:new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        })
    });

    return this._http.request(_request)
    .map((res:Response) => res.json())
    .catch((error:any) => Observable.throw({status:error.status,message:error.json().error})); 



  };//end quickSearchRequest

  getSubjectObservable(): Observable<any> {
    return this.userSubject.asObservable();
  }

  setUser(data) {
    // this._localSt.store('userdata', JSON.stringify(data));
    this.userSubject.next({ product: 'rajesh' });
  }

  getvpstest(){
    return this._http.get("http://103.86.177.76/vpstest/")
  }

  clearUserData(){
    return this._storage.clear();
  }

}
