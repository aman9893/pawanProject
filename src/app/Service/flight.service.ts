import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
   providedIn: 'root'
})

export class FlightService {

  Url = environment.baseUrl;
   constructor(private http: HttpClient) { }

   getBookItinerary(booking) {
    const url = this.Url + `BookItinerary`;
    return this.http.post(url, booking, {});
 }
 //Call GetCountries API
 getCountries(language){
   const url = this.Url + `GetCountries`;
   return this.http.post(url, language, {});
 }
 //Call CarrierFOPStatus API
 getCarrierFOPStatus(){
   const url = this.Url + `CarrierFOPStatus`;
   return this.http.post(url, { "GetItineraryData_Input": { "customerCode": "ONWIBE2", "customerSubCode": "OERTW", "lang": "EN", "mode": "GEN"} }, {});
 }
 //Call GetCountries API
 getCarrierCards(carrier_code){
   const url = this.Url + `GetCarrierCards`;
   return this.http.post(url, carrier_code, {});
 }
 //Call repricing
 getAccuratePriceQuote(repriceJSON){
  const url = this.Url + `AccuratePriceQuote`;
  return this.http.post(url, repriceJSON, {});
}

}