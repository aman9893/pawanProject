import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {BookingsComponent} from './booking.component';

const productRoutes: Routes = []

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(productRoutes)
  ],
  declarations: [
      BookingsComponent
    ]
})
export class BookingsRoutingModule { }
