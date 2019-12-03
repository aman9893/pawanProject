import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingsRoutingModule} from './booking-routing.module'; //Added
import {SharedModule} from './../shared/shared.module';
import { PassengerInfoComponent } from './passenger-info/passenger-info.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
 import { BsDatepickerModule } from 'ngx-bootstrap';
import { ItineraryDetailsComponent } from './itinerary-details/itinerary-details.component';
import { PnrInfoComponent } from './pnr-info/pnr-info.component';
const routes: Routes = [
  {
    path:'passengerInfo', 
    component: PassengerInfoComponent,
    pathMatch: 'full',
  },{
    path:'ItineraryDetails', 
    component: ItineraryDetailsComponent,
    pathMatch: 'full',
  },
  {
    path:'pnrDetails', 
    component: PnrInfoComponent,
    pathMatch: 'full',
  },

];
@NgModule({
 
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule ,
    BookingsRoutingModule,  // Added
    SharedModule,
    RouterModule.forChild(routes),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [PassengerInfoComponent, ItineraryDetailsComponent, PnrInfoComponent]
})
export class BookingsModule {}



