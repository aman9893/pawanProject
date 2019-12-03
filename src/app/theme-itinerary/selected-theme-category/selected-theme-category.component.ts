import { Component, OnInit } from '@angular/core';
import {ThemeService} from './../../Service/theme.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-selected-theme-category',
  templateUrl: './selected-theme-category.component.html',
  styleUrls: ['./selected-theme-category.component.less']
})
export class SelectedThemeCategoryComponent implements OnInit {
  
  selected_theme_category: any;
  selected_theme_category_info: any;
  theme_itinerary_details: Object;

  constructor(private theme:ThemeService,private router:Router) { }

  ngOnInit() {
    this.selected_theme_category = JSON.parse(sessionStorage.getItem('theme_category_itinerary_info'));
    this.selected_theme_category_info = JSON.parse(sessionStorage.getItem('selected_theme_category_info'));
    
  }
  //
 selected_theme_itinerary_details(itineraryId){
  for(let i=0;i<Object(this.selected_theme_category).length;i++){
    if(this.selected_theme_category[i].itinId===itineraryId){
    sessionStorage.removeItem("selected_theme_details");
    sessionStorage.setItem("selected_theme_details", JSON.stringify(this.selected_theme_category[i]));
    }
  }
  this.theme.themeItineraryDetails(itineraryId).subscribe(data=>{
    if(data){
    this.theme_itinerary_details=data;
    sessionStorage.removeItem("theme_itinerary_info");
    sessionStorage.setItem("theme_itinerary_info", JSON.stringify(this.theme_itinerary_details));
    this.router.navigate(['/theme/theme_category_itinerary']);
    }else{
      alert("price is not available. So, We are not able to fetch selected theme itinerary details.");
    }
  },
    error => {
      alert(error.error);
    }
  );
 }
}
