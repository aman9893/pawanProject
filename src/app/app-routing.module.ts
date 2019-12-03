import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationsModule } from './authentications/authentication.module';
import {BookingsModule} from './bookings/booking.module';
import { FlightModule } from './flight/flight.module';
import {SharedModule} from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/auth.guard';
import { ChooseFlightComponent } from './choose-flight/choose-flight.component';
import { FlightReviewComponent } from './flight-review/flight-review.component';
import {DatepickerComponent} from './datepicker/datepicker.component';



const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../app/authentications/authentication.module').then(m => m.AuthenticationsModule)
  },
  {
    path:'flight',
    loadChildren: () => import('../app/flight/flight.module').then(m => m.FlightModule),
    // canActivate:[AuthGuard]
  },
  {
    path:'bookings',
    loadChildren: () => import('../app/bookings/booking.module').then(m => m.BookingsModule),
    // canActivate:[AuthGuard]
  },
  {
    path:'shared',
    loadChildren: () => import('../app/shared/shared.module').then(m => m.SharedModule),
    // canActivate:[AuthGuard]
  },
  {
    path:'theme',
    loadChildren: () => import('../app/theme-itinerary/theme-itinerary.module').then(m => m.ThemeItineraryModule),
    // canActivate:[AuthGuard]
  },
  {
    path:'choose-flight',
    component: ChooseFlightComponent,
    // canActivate:[AuthGuard]
  },
  {
    path:'review-flight',
    component: FlightReviewComponent,
    // canActivate:[AuthGuard]
  },
  {
    path:'home',
    component: HomeComponent 
  },
  {
    path:'date',
    component: DatepickerComponent 
  },
  { 
    path: "**",
    redirectTo:"",
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthenticationsModule, SharedModule, FlightModule, BookingsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
