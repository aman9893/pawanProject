import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { FormBuilder,FormGroup,Validators,AbstractControl} from "@angular/forms";
import {ThemeService} from './../../Service/theme.service'
@Component({
  selector: 'app-theme-category-itinerary',
  templateUrl: './theme-category-itinerary.component.html',
  styleUrls: ['./theme-category-itinerary.component.less']
})
export class ThemeCategoryItineraryComponent implements OnInit {
  selected_theme_details: any;
  theme_itinerary_info: any;
  station_and_city_list: any;
  itinerary_city_list:any=[];
  list_of_city: any=[];
  airportsList: any ={};
  enterDepartureCityForm: FormGroup;
  submitted: boolean=false;
  formatter = (x: {name: string}) => x.name;
  public departureCity: any;
  airportList: any;
  airportData: any;
  suggestedItineraryFlag: boolean=false;
  suggestedItinerary: any;
  suggestedItineraryCityList: any=[];
  
  constructor(private router:Router,private formBuilder: FormBuilder,private theme:ThemeService) { 
    
  }
  ngOnInit() {
    this.enterDepartureCityForm = this.formBuilder.group({
      departureCity: [""],
    });
    this.selected_theme_details = JSON.parse(sessionStorage.getItem('selected_theme_details'));
    this.theme_itinerary_info = JSON.parse(sessionStorage.getItem('theme_itinerary_info'));
    this.station_and_city_list = JSON.parse(sessionStorage.getItem('station_and_city_list'));
    this.getAirportAndCity();
    for(let i=0 ;i<this.station_and_city_list.cities.length;i++){
      this.list_of_city.push(this.station_and_city_list.cities[i].name)
    }
    const intineraries=this.theme_itinerary_info.itinerary;
    const itinerary:[]=intineraries.split(',');
    for(let i=0; i<itinerary.length; i++){
      for(let k=0;k<this.station_and_city_list.cities.length;k++){
        if(this.station_and_city_list.cities[k].cityCode===itinerary[i]){
          this.itinerary_city_list.push(this.station_and_city_list.cities[k].name)
        }
      }
    }
  }
  //autosuggest city
  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term === '' ? []
      : this.airportList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )
//Go back to previous page
  backToItinerary(){
    this.router.navigate(['/theme/selected_theme_category']);
  }

//Concatenate airport and city name with code
  getAirportAndCity(){
    const cities_list=this.station_and_city_list.cities;
    const stations_list=this.station_and_city_list.stations;
    this.airportData= cities_list.concat(stations_list);
    this.airportList=this.airportData;
    let extraAirports = [];
    for (let i = 0; i < this.airportData.length; i++) {
      if(this.airportData[i].staCode){
        let name = this.airportData[i].name + " (" + this.airportData[i].cityCode + ")";
        extraAirports.push(name);
        this.airportList[i]['name'] = this.airportData[i].name + " (" + this.airportData[i].staCode + ")";
      }else{
        this.airportList[i]['name'] = this.airportData[i].name + " (" + this.airportData[i].cityCode + ")";
      }
    }
  }
  //get control instance of form
  get submit_dpt_location_form() {
    return this.enterDepartureCityForm.controls;
  }
  submitLocation(){
    this.submitted = true;
    if (this.enterDepartureCityForm.invalid){
      return;
    }else{
      if(this.suggestedItineraryFlag){
      this.router.navigate(['/']);
      }
    }
  }
  selectedAirport(item){
    this.suggestedItineraryCityList=[];
    const checkedCity=item.item.cityCode;
    if(checkedCity){
      const suggestedItineraries={
        "itinerary":this.theme_itinerary_info.itinerary,
        "stationCode":checkedCity
      }
      this.theme.themeSuggestedItinerary(suggestedItineraries).subscribe(data=>{
        if(data){
          this.suggestedItineraryFlag=true;
          this.suggestedItinerary=data['itinerary'];
          const suggestedItineraryList:[]=this.suggestedItinerary.split(',');
          for(let i=0;i<suggestedItineraryList.length;i++){
            for(let j=0;j<this.station_and_city_list.cities.length;j++){
              if(suggestedItineraryList[i]===this.station_and_city_list.cities[j].cityCode){
                this.suggestedItineraryCityList.push(this.station_and_city_list.cities[j].name)
              }
            }
          }
        }
      },
      error => {
        alert(error.error);
      });
    }
  }
}
