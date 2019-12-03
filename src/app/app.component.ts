import { Component } from '@angular/core';
import { TranslateService } from './Service/translate.service';
declare var jQuery:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

 

 /*  title = 'rtw2ui';
  getRourter:string;
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    this.getRourter=window.location.pathname;
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  } */

constructor(private translate: TranslateService){
 /*  translate.use('en').then(() => {
    console.log(translate.data);
  }); */
  console.log(translate.data);
}

setLang(event:any) {
  this.translate.use(event.target.value);
}

}
