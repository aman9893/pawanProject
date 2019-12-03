import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class AirportService {

    constructor(private http: HttpClient) { }
  
    getUserList() {
      let headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json');
  
      return this.http.get('./assets/json/data.json', { headers });
  }
  
  }
  