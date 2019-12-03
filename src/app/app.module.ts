import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER,LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AsyncPipe, registerLocaleData } from '@angular/common';
/* ngx-translate and the http loader */
/* import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; */
/* end here */
import { HomeComponent } from './home/home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FlightModule } from './flight/flight.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChooseFlightComponent } from './choose-flight/choose-flight.component';
import { FlightReviewComponent } from './flight-review/flight-review.component';

import { OwlModule } from 'ngx-owl-carousel';
import { MustMatchDirective } from './_helpers/must-match.directive';
import { MustMatch} from './_helpers/mush-match.validator';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OneworldDatepickerComponent } from './components/oneworld-datepicker/oneworld-datepicker.component';
import { SelectAirportComponent } from './components/select-airport/select-airport.component';

import { ThemeItineraryModule } from './theme-itinerary/theme-itinerary.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderComponent } from './loader/loader.component';
import { LoaderInterceptorService } from './_helpers/loader-interceptor.service';
/* import { TranslatePipe } from './pipes/translate.pipe'; */
import { TranslateService } from './Service/translate.service';
/* import {MinuteSecondsPipe} from './pipes/minutesSecondsPipe'; */

// required for AOT compilation for ngx-translate
/* export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
} */

//localization via abnother way
export function setupTranslateFactory(
  service: TranslateService): Function {
  return () => service.use('en');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChooseFlightComponent,
    FlightReviewComponent,
    MustMatchDirective,
    DatepickerComponent,
    LoaderComponent,
    OneworldDatepickerComponent,
    SelectAirportComponent,
    /* TranslatePipe */
    /* MinuteSecondsPipe */
  ],
  imports: [
    BrowserModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FlightModule,
    OwlModule,
    NgxSpinnerModule,
    ThemeItineraryModule,
   /*  TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), */
   
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    AsyncPipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [ TranslateService ],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
