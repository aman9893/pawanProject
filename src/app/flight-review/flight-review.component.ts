import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-review',
  templateUrl: './flight-review.component.html',
  styleUrls: ['./flight-review.component.less']
})
export class FlightReviewComponent implements OnInit {

  // all flight property
  flightResponse: any;
  airportList: any;
  showDetail: boolean;
  selectedFlightIndex: any;
  passengers:any = [];
  displayPassengerBreakup:any;

  // price
  FlightPrice: any;
  taxBreakDownAdult: any;
  taxBreakDownChild: any;
  constructor(private router: Router, ) { }

  ngOnInit() {
    this.flightResponse = JSON.parse(sessionStorage.getItem('selectedFlightRes'));
    this.airportList = JSON.parse(sessionStorage.getItem('airportList'));
    this.FlightPrice = JSON.parse(sessionStorage.getItem('FlightPrice'));
    this.travellerPriceBreakups();

    this.passengers = JSON.parse(sessionStorage.getItem('no_of_passenger'));

    if(this.FlightPrice.taxLadders) {
      this.taxBreakDownAdult = this.FlightPrice.taxLadders.taxLadder;
      /* if (this.FlightPrice.taxLadders.taxLadder.length > 1) {
        this.taxBreakDownChild = this.FlightPrice.taxLadders.taxLadder[1];
      } */
      /* let taxladders = [];
      for(var i = 0; i < this.FlightPrice.taxLadders.taxLadder.length; i++){
        
      } */
    }
  }

  travellerPriceBreakups(){
    let farePerAdult;
      let taxPerAdult;
      let farePerChild;
      let taxPerChild;
      let currencyType;
      let tripvar = [];
    for(var i = 0; i < this.FlightPrice.tripVariables.tripVar.length; i++){

      if(this.FlightPrice.tripVariables.tripVar[i].name === "farePerAdult"){
        farePerAdult = this.FlightPrice.tripVariables.tripVar[i].value;
      }
      if(this.FlightPrice.tripVariables.tripVar[i].name === "taxPerAdult"){
        taxPerAdult = this.FlightPrice.tripVariables.tripVar[i].value;
      }
      
      if(this.FlightPrice.tripVariables.tripVar[i].name === "farePerChild"){
        farePerChild = this.FlightPrice.tripVariables.tripVar[i].value;
      }
      if(this.FlightPrice.tripVariables.tripVar[i].name === "taxPerChild"){
        taxPerChild = this.FlightPrice.tripVariables.tripVar[i].value;
      }
      if(this.FlightPrice.tripVariables.tripVar[i].name == "currencyType"){
        currencyType = this.FlightPrice.tripVariables.tripVar[i].value;
      }

      let tripvar = [
        {
          'farePerAdult' : farePerAdult,
          'taxPerAdult' : taxPerAdult,
          'total' : parseInt(farePerAdult) + parseInt(taxPerAdult),
          'currencyType' : currencyType
        },
        {
          'farePerChild' : farePerChild,
          'taxPerChild' : taxPerChild,
          'total' : parseInt(farePerChild) + parseInt(taxPerChild),
          'currencyType' : currencyType
        }
      ]
      this.displayPassengerBreakup = tripvar;

      console.log(this.displayPassengerBreakup)
    }
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
  personalInfoPage() {
    this.router.navigate(['/bookings/passengerInfo']);
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
