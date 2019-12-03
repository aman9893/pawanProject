import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationsComponent } from './authentication.component';
/* import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component'; */
import { LoginComponent } from './../shared/login/login.component';


const routes: Routes = [ 
  { 
    path:'auth', 
    component: AuthenticationsComponent,
    children: [
      { path:':signin', component: LoginComponent },
      /* { path: 'signup', component: SignUpComponent } */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationsRoutingModule { }