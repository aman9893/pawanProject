import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pnr-info',
  templateUrl: './pnr-info.component.html',
  styleUrls: ['./pnr-info.component.less']
})
export class PnrInfoComponent implements OnInit {
  passengersList: any;
  contactInfo: any;
  flightResponse: any;
  airportList: any;
  selectedFlightIndex: any;
  showDetail: boolean;
  pnr_no: any;

  constructor() { }

  ngOnInit() {
    this.passengersList = JSON.parse(sessionStorage.getItem('travelers_details'));
    this.contactInfo = JSON.parse(sessionStorage.getItem('contact_details'));
    console.log("contact details pnr page",this.contactInfo);
    this.flightResponse = JSON.parse(sessionStorage.getItem('selectedFlightRes'));
    this.airportList = JSON.parse(sessionStorage.getItem('airportList'));
    this.pnr_no = JSON.parse(sessionStorage.getItem('pnr_details'));
  }

// select flight from result
selectFlightSegment(index) {
  this.selectedFlightIndex = index;
}
// formate date
formatDepartureDate(depdate) {
  return depdate.dd + '/' + depdate.mm + '/' + depdate.yyyy;
}
// get airport name
getAirportName(cityCode) {
  for (let i = 0; i < this.airportList.length; i++) {
    if (this.airportList[i].cityCode === cityCode) {
      return this.airportList[i].name;
    }
  }
}
clickShowDetail() {
  this.showDetail = !this.showDetail;
}
  // formate time from minutes
  getTimeInHours(number) {
    var num = number;
    if (num > 60) {
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
    } else {
      hours = 0;
      var rhours = Math.floor(hours);
      var minutes = num * 60;
    }
    var rminutes = Math.round(minutes);
    // console.log(num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).");
    return rhours < 10 ? '0' + rhours : rhours + " : " + (rminutes < 10 ? '0' + rminutes : rminutes);
  }

  getairlineLogo(leg){
    if(leg.length === 1) {
     return leg[0].carCode;
    } else {
      if(leg[0].carCode === leg[1].carCode) {
        return leg[0].carCode;
      }
     return 'OW';
    }
  }

}
