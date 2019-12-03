import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import {AuthenticationsRoutingModule} from './authentication-routing.module';
/* import { LoginComponent } from './../shared/login/login.component'; */
/* import { SignUpComponent } from './sign-up/sign-up.component'; */
import { AuthenticationsComponent } from './authentication.component';


@NgModule({
  declarations: [
    /* LoginComponent, 
    SignUpComponent, */
    /* LoginComponent, */
    AuthenticationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AuthenticationsRoutingModule,
    
  ],
  exports : [
    RouterModule,
  ],
  providers: [],
})
export class AuthenticationsModule { }
