import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response, Request } from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';




@Injectable()
export class DataProvider {

  BASE_URL = "http://localhost:5000/api/";

  constructor(private _http: Http) {
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

    return this._http.request(_request)
    .map((res:Response) => res.json())
    .catch((error:any) => Observable.throw({status:error.status,message:error.json().Message})); 


  }

}
