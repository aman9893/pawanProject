import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  Url = environment.baseUrl;
  constructor(private http: HttpClient) { }

  //Theme category
  themeCategories(){
    const url = this.Url + `ThemeCategories`;
    return this.http.get(url);
  }

  //theme category itinerary
  themeCategoryItineraries(categoryName){
    const category_name={
      "categoryName": categoryName
    }
    const url = this.Url + `ThemeCategoryItineraries`;
    return this.http.post(url,category_name,{});
  }

  //ThemeItineraryDetails api
  themeItineraryDetails(itineraryId){
    const itinerary_id={
      "itinId": itineraryId
    }
    const url = this.Url + `ThemeItineraryDetails`;
    return this.http.post(url,itinerary_id,{});
  }
//ThemeItineraryDetails Api
themeSuggestedItinerary(value){
  const url = this.Url + `ThemeSuggestedItinerary`;
  return this.http.post(url,value,{});
}

}
