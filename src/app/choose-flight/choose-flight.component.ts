import { Component, OnInit, HostListener, Inject, ElementRef  } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';  
import { DOCUMENT } from '@angular/common';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FlightService } from '../Service/flight.service';

import * as $ from "jquery";
declare var $: any;

const today = new Date();
@Component({
  selector: 'app-choose-flight',
  templateUrl: './choose-flight.component.html',
  styleUrls: ['./choose-flight.component.less'],
  animations: [
    trigger('scrollAnimation', [
      state('show', style({
        opacity: 1,
        transform: "translateX(0)"
      })),
      state('hide',   style({
        opacity: 0,
        transform: "translateX(-100%)"
      })),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class ChooseFlightComponent implements OnInit {
  state = 'hide'
  showDetail: boolean;
  showselectedDetail:boolean;
  // all property
  selectedFlightIndex: number = 0;
  selectedSegment: number = 0;
  newIndex: number = 0;
  buttonLabel: string = 'Next Flight';
  showMoreLable: string = 'Show more';
  airportList: any;
  departureAirport: any;
  arrivalAirport: any;
  // flight result property
  flightRes: any;
  allFlightResponse: any;
  FlightPrice: any;
  /* Date pickers proprty */ // formate date 09/19/2019
  changeDate: any;
  displayMonths = 2;
  showWeekNumbers = false;
  outsideDays = 'visible';
  departureDate: any;
  maxDate: any;
  minDate: NgbDateStruct = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  // repricing json
  selectedFlightRes: any = [];
  legArray = [];
  surcharge_details: {};
  ArvjournerySegmentDetails: {};
  DptjournerySegmentDetails: {};
  seg_legs: {};
  legDetails = {};
  finalObj = [];
  repriceJSON:any = {};
  passengers:any;
  numAdults: any;
  numChildren: any;
  passengerErrormessage:any;
  cabinClass: string;
  passengerLabel: string;
  ItineraryDetailsAfterAvaiSchedules:any = [];
  AllErrmessages:any = [];
  itineraryErrMessages:any = [];
  disableReview:boolean = false;
  isSticky: boolean = false;
  selectedFlightsList:any = [];
  current: number = 0-1;
  
  

  constructor(private router: Router, private flightService: FlightService,public el: ElementRef) {}

  ngOnInit() {
    this.flightRes = JSON.parse(sessionStorage.getItem('allFlightResult'));
    this.allFlightResponse = this.flightRes;
    /* this.ItineraryDetailsAfterAvaiSchedules = JSON.parse(sessionStorage.getItem('ItineraryDetailsAfterAvaiSchedules'));
    if(this.ItineraryDetailsAfterAvaiSchedules['journeySegList']){
      this.itineraryErrMessages = this.ItineraryDetailsAfterAvaiSchedules['journeySegList'].journeySeg;
    } */
    this.AllErrmessages = JSON.parse(sessionStorage.getItem('loadMessage'));
    this.arrangeFlightResponse(this.flightRes);
    this.airportList = JSON.parse(sessionStorage.getItem('airportList'));
    this.FlightPrice = JSON.parse(sessionStorage.getItem('FlightPrice'));
    this.passengers = JSON.parse(sessionStorage.getItem('no_of_passenger'));
    this.numAdults = this.passengers.numAdults;
    this.numChildren = this.passengers.numChildren;
    this.cabinClass = this.allFlightResponse[0].flights.flight[0].classAndAvailability.class[0].userClassType
    // initial values
    this.showDetail = false;
    this.filterFlightRes();
    this.allFirstIndexFlight();

}

@HostListener('window:scroll', ['$event'])
checkScroll() {
  /* const componentPosition = this.el.nativeElement.offsetTop
  const scrollPosition = window.pageYOffset */
  let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
  let max = document.documentElement.scrollHeight;

  if(((pos > max) || (pos == max))){
    this.state = 'show'
  }else{
    this.state = 'hide'
  }

  /* if (scrollPosition <= componentPosition) {
    this.state = 'show'
  } else {
    this.state = 'hide'
  } */
}
  
  getsegwarningMessage(code){
    for(var i = 0; i < this.AllErrmessages.length; i++){
      if(code == this.AllErrmessages[i].code){
        return this.AllErrmessages[i].shortText
      }
    }
  }

  // @HostListener("window:scroll", ["$event"])
  // onWindowScroll() {
  // //In chrome and some browser scroll is given to body tag
  // let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
  // let max = document.documentElement.scrollHeight;
  // // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
  //  if(((pos > max) || (pos == max)))   {
  //    $('#selectedFlights_section .mb_flights_section').css({display:'block',transition:'2s ease-in-out'})
  //  //Do your action here
  //  console.log(pos)
  //  console.log(max)
  //  }else{
  //   $('#selectedFlights_section .mb_flights_section').css({display:'none',transition:'2s ease-in-out'})
  //  }
  // }
    


  // filter array to 3 row
  filterFlightRes() {
    for (let m = 0; m <= 2; m++) {
      const newFlight = this.allFlightResponse[m].flights.flight;
      let filterFlight = [];
      if(newFlight.length >= 3){
        for (let i = 0; i <= 2; i++) {
          filterFlight[i] = newFlight[i];
        }
      } else if(newFlight.length >= 2){
        for (let i = 0; i <= 1; i++) {
          filterFlight[i] = newFlight[i];
        }
      } else if(newFlight.length >= 1){
        filterFlight[0] = newFlight[0];
      }
      this.allFlightResponse[m].flights.flight = filterFlight;
    }
  }
  // sorting the flight response in order
  arrangeFlightResponse(flightRes) {
    for (let i = 0; i < flightRes.length; i++) {
      for (let j = i + 1; j < flightRes.length; j++) {
        if (this.allFlightResponse[i].sequenceNumber > this.allFlightResponse[j].sequenceNumber) {
          const obj = this.allFlightResponse[i];
          this.allFlightResponse[i] = this.allFlightResponse[j];
          this.allFlightResponse[j] = obj;
        }
      }
    }
  }
  // end here

  
  // generate all segment selected first index flight
  allFirstIndexFlight(){
    for (let i = 0; i < this.allFlightResponse.length; i++) {
      this.selectedFlightRes[i] = this.allFlightResponse[i].flights.flight[0];
    }
    // if (i === this.selectedSegment) {
    //   this.selectedFlightRes[this.selectedSegment] = this.allFlightResponse[this.selectedSegment].flights.flight[this.selectedFlightIndex];
    // } else {
    //   this.selectedFlightRes[i] = this.allFlightResponse[i].flights.flight[i];
    // }
  }

  // generate repricing JSON
  generateJSON() {
    //collect selected flight details
    for (let i = 0; i < this.selectedFlightRes.length; i++) {

      this.legArray = [];
      for (let j = 0; j < this.selectedFlightRes[i].legs.leg.length; j++) {
        if (!this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].surcharge) {
          this.surcharge_details;
        } else {
          this.surcharge_details =
            this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].surcharge;
        }
        const leg = {
          "dptCity": this.selectedFlightRes[i].legs.leg[j].dpt.cityCode,
          "dptCntry": this.selectedFlightRes[i].legs.leg[j].dpt.country,
          "dptDD": this.selectedFlightRes[i].legs.leg[j].legDepartureDate.dd,
          "dptMM": this.selectedFlightRes[i].legs.leg[j].legDepartureDate.mm,
          "dptYYYY": this.selectedFlightRes[i].legs.leg[j].legDepartureDate.yyyy,
          "dptRegion": "",
          "dptStation": this.selectedFlightRes[i].legs.leg[j].dpt.aptCode,
          "dptTerm": this.selectedFlightRes[i].legs.leg[j].dpt.terminal,
          "dptTimeLocal": this.selectedFlightRes[i].legs.leg[j].dptTime,
          "arvCity": this.selectedFlightRes[i].legs.leg[j].arv.cityCode,
          "arvCntry": this.selectedFlightRes[i].legs.leg[j].arv.country,
          "bookingNote": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].bookingNote,
          "arvDD": this.selectedFlightRes[i].legs.leg[j].legArriveDate.dd,
          "arvMM": this.selectedFlightRes[i].legs.leg[j].legArriveDate.mm,
          "arvYYYY": this.selectedFlightRes[i].legs.leg[j].legArriveDate.yyyy,
          "carCode": this.selectedFlightRes[i].legs.leg[j].carCode,
          "arvRegion": "",
          "arvStation": this.selectedFlightRes[i].legs.leg[j].arv.aptCode,
          "arvTerm": this.selectedFlightRes[i].legs.leg[j].arv.terminal,
          "arvTimeLocal": this.selectedFlightRes[i].legs.leg[j].arvTime,
          "changeOfEquip": this.selectedFlightRes[i].legs.leg[j].changeOfEquip,
          "equipCode": this.selectedFlightRes[i].legs.leg[j].dpt.terminal,
          "codeShare": this.selectedFlightRes[i].legs.leg[j].codeShare,
          "dayIndicator": this.selectedFlightRes[i].legs.leg[j].legDayIndicator,
          "flightMinutes": this.selectedFlightRes[i].legs.leg[j].flightMinutes,
          "flightNumber": this.selectedFlightRes[i].legs.leg[j].flightNumber,
          "layoverMinutes": this.selectedFlightRes[i].legs.leg[j].layoverMinutes,
          "legMiles": this.selectedFlightRes[i].legs.leg[j].legMiles,
          "number": this.selectedFlightRes[i].legs.leg[j].number,
          "operatedBy": "",
          "restrictionCode": this.selectedFlightRes[i].legs.leg[j].restrictionCode,
          "stopCodes": this.selectedFlightRes[i].legs.leg[j].stopCodes,
          "stops": this.selectedFlightRes[i].legs.leg[j].stops,
          "wetLease": this.selectedFlightRes[i].legs.leg[j].wetLease,
          "userClassType": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].userClassType,
          "amadeusClassCode": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].amadeusClassCode,
          "class": {
            "amadeusClassCode": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].amadeusClassCode,
            "availableSeats": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].availableSeats,
            "bookingNote": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].bookingNote,
            "surcharge": this.surcharge_details,

            "udCabinClass": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].udCabinClass,
            "udIndicator": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].udIndicator,
            "userClassType": this.selectedFlightRes[i].legs.leg[j].classAndAvailability.class[0].userClassType,
          },
          "dptCityName": this.selectedFlightRes[i].legs.leg[j].dpt.cityCode,
          "arvCityName": this.selectedFlightRes[i].legs.leg[j].arv.cityCode,
          "isPremiumEconomy": false
        }
        this.legArray = [...this.legArray, leg];
        if (j == this.selectedFlightRes[i].legs.leg.length - 1) {
          this.ArvjournerySegmentDetails = {
            "arvCity": this.selectedFlightRes[i].legs.leg[j].arv.cityCode,
            "arvMetro": "",
            "arvCntry": this.selectedFlightRes[i].legs.leg[j].arv.country,
            "arvDate": this.selectedFlightRes[i].legs.leg[j].legArriveDate.mm + "/" + this.selectedFlightRes[i].legs.leg[j].legArriveDate.dd + "/" + this.selectedFlightRes[i].legs.leg[j].legArriveDate.yyyy,
            "typeSeg": "FLIGHT",
            "dayIndicator": +this.selectedFlightRes[i].dayIndicator,
          }
        }
        if (j == 0) {
          this.DptjournerySegmentDetails = {
            "sequenceNumber": i + 1,
            "dptCity": this.selectedFlightRes[i].legs.leg[j].dpt.cityCode,
            "dptMetro": "",
            "dptCntry": this.selectedFlightRes[i].legs.leg[j].dpt.country,
            "dptDate": this.selectedFlightRes[i].legs.leg[j].legDepartureDate.mm + "/" + this.selectedFlightRes[i].legs.leg[j].legDepartureDate.dd + "/" + this.selectedFlightRes[i].legs.leg[j].legDepartureDate.yyyy,
          }
        }
        this.seg_legs = {
          "segLegs": {
            "flightIsAvailable": "true",
            "numLegs": this.selectedFlightRes[i].legs.leg.length,
            "leg": this.legArray
          }
        }
        const segment = Object.assign(this.DptjournerySegmentDetails, this.ArvjournerySegmentDetails, this.seg_legs);
        this.legDetails = segment;
      }
      this.finalObj = [...this.finalObj, this.legDetails];
    }

    this.repriceJSON = {
      "journey": {
        "customerCode": "ONWIBE2",
        "customerSubCode": "OERTW",
        "lang": "EN",
        "mode": "BOOK",
        "productCode": "ONWRTWIBE",
        "redId": "",
        "processType": "VALIDATION_REQUEST",
        "version": "",
        "whileLabelledCode": "OMC",
        "name": "My Itinerary",
        "customerInfo": {
          "itinRefCode": ""
        },
        "journeySegList": {
          "journeySeg":
            this.finalObj,
          "numJSegs": this.selectedFlightRes.length,
        },
        "contactInfo": {
          "contact": [
            {
              "name": "title",
              "value": ""
            },
            {
              "name": "firstName",
              "value": ""
            },
            {
              "name": "lastName",
              "value": ""
            },
            {
              "name": "telephone",
              "value": ""
            },
            {
              "name": "email",
              "value": ""
            },
            {
              "name": "street1",
              "value": ""
            },
            {
              "name": "street2",
              "value": ""
            },
            {
              "name": "city",
              "value": ""
            },
            {
              "name": "province",
              "value": ""
            },
            {
              "name": "country",
              "value": ""
            },
            {
              "name": "postalCode",
              "value": ""
            }
          ]
        },
        "travelInfo": {
          "numInfants": 0,
          "numChildren": this.numChildren,
          "numAdults": this.numAdults,
          "userClassType": this.selectedFlightRes[0].classAndAvailability.class[0].amadeusClassCode,
          "cityOfOrigin": this.selectedFlightRes[0].dpt.cityCode,
          "countryOfResidence": ""
        },
        "tripVariables":
          this.FlightPrice.tripVariables
        ,
        "taxLadders":
          this.FlightPrice.taxLadders,
        "itineraryOrigin": "",
        "sessionKey": JSON.parse(sessionStorage.getItem('sessionKey')),
        "firstSegCarrier": "BA"
      }
    };
  }

  // select flight from result
  selectFlightSegment(index, newIndex) {
    this.selectedFlightIndex = index;
    this.selectedSegment = newIndex;

    //if(this.selectedFlightIndex !== 0){
      this.selectedFlightRes[this.selectedSegment] = this.allFlightResponse[this.selectedSegment].flights.flight[this.selectedFlightIndex];
    //}
    
    this.generateJSON();
    this.flightService.getAccuratePriceQuote(this.repriceJSON).subscribe(data => {
      this.repriceJSON = {};
      this.finalObj = [];
    //  this.selectedFlightRes = [];
      this.FlightPrice = data['GetAccuratePriceQuote_Output'];
    });
  }
  // formate date
  formatDepartureDate(depdate) {
    return depdate.dd + '/' + depdate.mm + '/' + depdate.yyyy;
  }
  // get airport city name
  getAirportName(cityCode) {
    for (let i = 0; i < this.airportList.length; i++) {
      if (this.airportList[i].cityCode === cityCode) {
        return this.airportList[i].name;
      }
    }
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

  clickShowDetail() {
    this.showDetail = !this.showDetail;
  }
  clickShowDetailSelected() {
    this.showselectedDetail = !this.showselectedDetail;
  }
  showAllFlight() {
    if (this.allFlightResponse[0].flights.flight.length <= 3) {
      this.allFlightResponse = JSON.parse(sessionStorage.getItem('allFlightResult'));
      this.arrangeFlightResponse(this.flightRes);
      this.showMoreLable = '';  //show less
    } else if ((this.allFlightResponse[0].flights.flight.length >= 3) || (this.allFlightResponse[1].flights.flight.length >= 3) || (this.allFlightResponse[2].flights.flight.length >= 3)) {
      this.filterFlightRes();
      this.showMoreLable = 'Show more';
    }
  }
  
  // change tabs into iterrable form
  goToNextFlight() {
    this.selectedFlightsList = [];
    if (this.newIndex < (this.allFlightResponse.length - 1)) {
      if(this.selectedFlightIndex === 0){
        this.selectedFlightRes[this.selectedSegment] = this.allFlightResponse[this.selectedSegment].flights.flight[this.selectedFlightIndex];
      }
      this.newIndex = this.newIndex + 1;
      if (this.newIndex === (this.allFlightResponse.length - 1)) {
        /* if(this.ItineraryDetailsAfterAvaiSchedules.journeySummary.journeyStatus == 'invalid'){
          this.buttonLabel = 'Review Flights';
          this.disableReview = true;
          return;
        }else{
          this.disableReview = false;
          this.buttonLabel = 'Review Flights';
        } */
        this.disableReview = false;
        this.buttonLabel = 'Review Flights';
      }
      this.selectedFlightIndex = 0;
      this.selectedSegment = this.newIndex;
      this.showDetail = false;
      //this.selectedFlightsList;
      for(var i = 0; i < this.newIndex; i++){
        this.selectedFlightsList.push(this.selectedFlightRes[i]);
      }
      this.state = 'hide'
      return this.newIndex;
    } else {
      this.selectFlightToReview();
    }
  }
  // go to next page
  selectFlightToReview() {
    // this.selectedFlightRes = [];
    // for (let i = 0; i < this.allFlightResponse.length; i++) {
    //   this.selectedFlightRes[i] = this.allFlightResponse[i].flights.flight[this.selectedFlightIndex];
    // }
    sessionStorage.setItem('selectedFlightRes', JSON.stringify(this.selectedFlightRes));
    sessionStorage.setItem('FlightPrice', JSON.stringify(this.FlightPrice));
    this.router.navigate(['/review-flight']);
  }
  
  //On selecting the breadcrum
  flightNavigation(idx){
    this.buttonLabel = 'Next Flight';
    this.newIndex = idx;
    if (this.newIndex < (this.allFlightResponse.length)) {
      if(this.selectedFlightIndex === 0){
        this.selectedFlightRes[this.selectedSegment] = this.allFlightResponse[this.selectedSegment].flights.flight[this.selectedFlightIndex];
      }
      if (this.newIndex === (this.allFlightResponse.length - 1)) {
        this.buttonLabel = 'Review Flights';
      }
      this.selectedFlightIndex = 0;
      this.selectedSegment = this.newIndex;
      this.showDetail = false;
      return this.newIndex;
    } else {
      this.selectFlightToReview();
    }
  }
  // navigate date
  navigateDate(event) {
    // console.log('navigate date');
  }
  // date selection
  onchangeDateSelection(event) {
  }

  // Get field name for new flight row
  getFieldName(index: number, name: string) {
    return `${name}${index}`;
  }
  clearSessionStorage() {
    //sessionStorage.clear();
  }
  // show airline logo according to response
  getairlineLogo(leg) {
    if (leg.length === 1) {
      return leg[0].carCode;
    } else {
      if (leg[0].carCode === leg[1].carCode) {
        return leg[0].carCode;
      }
      return 'OW';
    }
  }

  // unknown method
  // show flight result
  getIndex(index) {
    for (let i = 0; i < this.allFlightResponse.length; i++) {
      if (this.allFlightResponse[0].sequenceNumber === (index + 1)) {
        return true;
      } else {
        return false;
      }
    }
  }

  minusAdult(sum){
    if(sum > 1){
      this.numAdults = parseInt(this.numAdults) - 1;
      return this.numAdults;
    }
  }
  addAdult(sum){
    if(sum < 9){
      this.numAdults = parseInt(this.numAdults) + 1;
      return this.numAdults;
    }

  }
  minusChildren(noChildren){
    if(noChildren > 0){
      this.numChildren = parseInt(this.numChildren) - 1;
      return this.numChildren;
    }
  }
  addChildren(noChildren){
    if(noChildren < 4){
      this.numChildren = parseInt(this.numChildren) + 1;
      return this.numChildren;
    }
  }
  cabinChangedMobile(value: string){
  this.cabinClass = value;
  }

  updatePassengerCabin() {
    this.passengerErrormessage = "";
    const numAdults = this.numAdults;
    const numChildren = this.numChildren; 
    const sum = Number(numAdults) + Number(numChildren);
    if(sum > 9){
      this.passengerLabel = "invalid selection";
    }else if(numAdults < numChildren){
        this.passengerLabel = "invalid selection";
      }else{
        this.passengerErrormessage = "";
        this.passengerLabel = parseInt(this.numAdults) + parseInt(this.numChildren) + ' Passenger(s)' + ', ' + this.cabinClass;
      }

    if(this.selectedFlightIndex !== 0){
      this.selectedFlightRes[this.selectedSegment] = this.allFlightResponse[this.selectedSegment].flights.flight[this.selectedFlightIndex];
    }
      this.generateJSON();
      this.repriceJSON['journey'].travelInfo.numChildren = this.numChildren;
      this.repriceJSON['journey'].travelInfo.numAdults = this.numAdults;
      this.repriceJSON['journey'].travelInfo.userClassType = this.cabinClass;
    this.flightService.getAccuratePriceQuote(this.repriceJSON).subscribe(data => {
      this.repriceJSON = {};
      this.finalObj = [];
      this.FlightPrice = data['GetAccuratePriceQuote_Output'];
      this.passengers = {
        numAdults : this.numAdults,
        numChildren : this.numChildren
      }
      sessionStorage.setItem('no_of_passenger', JSON.stringify({'numAdults': this.numAdults, 'numChildren': this.numChildren,'total_no_of_passenger':Number(this.numAdults) + Number(this.numChildren)}));
    });
  }


}
    
