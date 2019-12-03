import { Component, OnInit } from '@angular/core';
import {ThemeService} from './../../Service/theme.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-theme-category',
  templateUrl: './theme-category.component.html',
  styleUrls: ['./theme-category.component.less']
})
export class ThemeCategoryComponent implements OnInit {
  
  theme_category_details: any;
  theme_category_itinerary_details:any;
  nextPage: string;

  constructor(private theme:ThemeService,private router:Router) { 
    this.getThemeCategories();

  }

  ngOnInit() {
  }

  getThemeCategories(){
    this.theme.themeCategories().subscribe(data => {
      if(data){
      this.theme_category_details = data;
      }else{
        alert("error has occurred");
      }
    },
      error => {
        alert(error.error);
      }
    )
  }
  category_details(categoryName,catId){
    for(let i=0;i<Object(this.theme_category_details).length;i++){
      if(this.theme_category_details[i].catId===catId){
      sessionStorage.removeItem("selected_theme_category_info");
      sessionStorage.setItem("selected_theme_category_info", JSON.stringify(this.theme_category_details[i]));
      }
    }
    this.theme.themeCategoryItineraries(categoryName).subscribe(data=>{
      if(data){
      this.theme_category_itinerary_details=data;
      sessionStorage.removeItem("theme_category_itinerary_info");
      sessionStorage.setItem("theme_category_itinerary_info", JSON.stringify(this.theme_category_itinerary_details));
      this.router.navigate(['/theme/selected_theme_category']);
      }else{
        alert("This theme category is not available");
      }
    },
      error => {
        alert(error.error);
      }
    );
  }
}
