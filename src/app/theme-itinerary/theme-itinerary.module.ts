import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { ThemeCategoryComponent } from './theme-category/theme-category.component';
import { SelectedThemeCategoryComponent } from './selected-theme-category/selected-theme-category.component';
import { ThemeCategoryItineraryComponent } from './theme-category-itinerary/theme-category-itinerary.component';

const routes: Routes = [
  {
    path:'theme_category', 
    component: ThemeCategoryComponent,
    pathMatch: 'full',
  },
  {
    path:'selected_theme_category', 
    component: SelectedThemeCategoryComponent,
    pathMatch: 'full',
  },
  {
    path:'theme_category_itinerary', 
    component: ThemeCategoryItineraryComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [
    ThemeCategoryComponent,
    SelectedThemeCategoryComponent,
    ThemeCategoryItineraryComponent
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ThemeItineraryModule {

 }
