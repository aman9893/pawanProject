import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { MapData } from './../Interface/homeInterface';
import { environment } from '../../environments/environment';

@Injectable({
   providedIn: 'root'
})

export class HomeService {

   Url = environment.baseUrl;
   constructor(private http: HttpClient) {
   }

   getUniqueToken() {
      let headers = new HttpHeaders();
      headers.set('Content-Type', 'application/json');
      const url = this.Url + `UniqueToken`;
      return this.http.post(url, {}, { headers, responseType: 'text' });
   }
   getMapData() {
      const url = this.Url + `MapData`;
      return this.http.post<MapData>(url, { "GetMapData_Input": { "customerCode": "ONWIBE2", "customerSubCode": "OERTW", "lang": "EN", "mode": "GEN", "productCode": "ONWRTWIBE" } }, {});
   }
   getLoadMessages() {
      const url = this.Url + `LoadMessages`;
      return this.http.post(url, { "LoadMessages_Input": { "customerCode": "ONWIBE2", "lang": "EN", "mode": "GEN" } }, {});
   }
   geItineraryData() {
      const url = this.Url + `ItineraryData`;
      return this.http.post(url, { "GetItineraryData_Input": { "customerCode": "ONWIBE2", "customerSubCode": "OERTW", "lang": "EN", "mode": "BOOK", "productCode": "ONWRTWIBE" } }, {});
   }
   getSessionKey() {
      const url = this.Url + `GetSessionKey`;
      return this.http.post(url, { "input": "" }, {});
   }
   getRouteCalendar(calenderObj) {
      const url = this.Url + `RouteCalendar`;
      return this.http.post(url, calenderObj, {});
   }
   getItinerary(itinerary) {
      const url = this.Url + `Itinerary`;
      return this.http.post(url, itinerary, {});
   }
   getSessionTracker(itinerary) {
      const url = this.Url + `SessionTracker`;
      return this.http.post(url, itinerary, {});
   }
   getAvailableSchedules(searchData) {
      const url = this.Url + `AvailableSchedules`;
      return this.http.post(url, searchData, {});
   }
   ThemeItineraries() {
      const url = this.Url + `ThemeItineraries`;
      return this.http.get(url);
   }
   getGeolocation(lat) {
      const url = this.Url + 'NearestAirport';
      return this.http.post(url, lat, {});
   }


   /* getPosition(): Promise<any>{
      if (navigator.geolocation) {
         console.log('jkh',navigator.geolocation);
         return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resp => {
               resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
               },
               err => {
               reject(err);
               });
         });
      }
   } */
}