import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { ProgressMaskComponentComponent } from './progress-mask-component/progress-mask-component.component';

// bootstap- angular and date picker
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AaDatepickerModule } from 'ngx-animating-datepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// angular material
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ModalModule, WavesModule, InputsModule, ButtonsModule } from 'angular-bootstrap-md'
import { from } from 'rxjs';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SocialLoginModule } from 'angularx-social-login';
import {MinuteSecondsPipe} from '../pipes/minutesSecondsPipe';
import { AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider  } from 'angularx-social-login';
import { TranslatePipe } from '../pipes/translate.pipe';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('741595209280-23n4f4m93efe1bfgq5ppjdjqlkepmdli.apps.googleusercontent.com')
    // provider: new GoogleLoginProvider('509607570927-hes2ld8mi3t5g8h5vc6ot56fllk4b6on.apps.googleusercontent.com')  // for local only
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    //provider: new FacebookLoginProvider('438454600191974')
    provider: new FacebookLoginProvider('530863714431774')
    //provider: new FacebookLoginProvider('887241515003246')  // for local only
  },
  {
    id: LinkedInLoginProvider.PROVIDER_ID,
    provider: new LinkedInLoginProvider("86nudwarkdliab")
  }
]);

export function provideConfig() {
  return config;
}

const routes: Routes = [
  {
    path:'nav', 
    component: NavComponent,
    pathMatch: 'full',
  },
  {
    path: 'footer',
    component: FooterComponent,
    pathMatch: 'full'
  },
  {
    path: 'signin',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'signup',
    component: SignUpComponent,
    pathMatch: 'full'
  },
  {
    path: 'rtwloginmodule/ResetPassword.aspx',
    component: ResetPasswordComponent,
    pathMatch: 'full'
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [NavComponent,TranslatePipe, FooterComponent,SignUpComponent, LoginComponent, ResetPasswordComponent, ForgotPasswordComponent, ProgressMaskComponentComponent,MinuteSecondsPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    MDBBootstrapModule.forRoot(),
    SocialLoginModule,
    AaDatepickerModule,
    NgbModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatAutocompleteModule,
    ModalModule, 
    WavesModule, 
    InputsModule, 
    ButtonsModule,
    RouterModule.forChild(routes),
  ],
  exports : [
    NavComponent,
    FormsModule,
    LoginComponent,
    SignUpComponent,
    ReactiveFormsModule ,
    MDBBootstrapModule,
    AaDatepickerModule,
    NgbModule,
    FooterComponent,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatAutocompleteModule,
    ModalModule, 
    WavesModule, 
    InputsModule, 
    ButtonsModule,
    ProgressMaskComponentComponent,
    MinuteSecondsPipe,
    TranslatePipe
  ],
  providers: [ {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
})
export class SharedModule { }
