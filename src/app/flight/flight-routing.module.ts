import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlightComponent } from './flight.component';
import {FlightSelectComponent} from './flight-select/flight-select.component';

const productRoutes: Routes = [
  {
    path: '', 
    component: FlightComponent,
    children: [
      { path: '', component: FlightSelectComponent }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(productRoutes)
  ],
  declarations: [ FlightComponent, FlightSelectComponent],
  exports : [
    FlightComponent,
    FlightSelectComponent,
  ]
})
export class FlightRoutingModule { }
