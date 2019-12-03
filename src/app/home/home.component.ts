import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Moment } from 'moment';
import { AirportService } from '../Service/airport.service';
import { OneworldDatepickerComponent } from '../components/oneworld-datepicker/oneworld-datepicker.component'
// auto complete
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { HomeService } from './../Service/home.service';
import { StoreService } from './../Service/store.service';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FlightSearch } from './../Interface/homeInterface';
import * as $ from "jquery";
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
declare var $: any;

const today = new Date();
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {


  searchFlight: FlightSearch[] = [];
  passenger: any;
  cabinClass: string;
  flightPreference: string;
  passengerList: Array<any>;
  cabinClassList: Array<any>;
  airlinePreferenceList: Array<any>;
  imageList: Array<any>;
  flightList: Array<any>;
  airportsData: any;
  lastkeydown1: number = 0;
  userList1: any;
  airportsList: any = [];
  show: boolean = false;
  hideVal: any = 10000;
  user_details: any;
  travellers:any = {};
  passengers:any;
  showMask:boolean = false;
  passengerErrormessage:any;
  passengerErrormessageDP:any;
  itinerarySegmenterrs:any = [];
  itineraryErrMsgLists:any = [];
  isDisableSearch = true;
  isTravellersValid = true; 
  isEnableItinerarysearch = false;
  isAllAirportsValid:boolean = true;
  showCalendarId: number;
  showDepartAirportId: number;
  loadingCalendar: boolean = false;

  public buttonName:any = 'Show';
  numAdults: any = 1;
  numChildren: any = 0;
  public lat;
  public lng;

  //carousel
  carouselOptions = {
    pagination: '.swiper-pagination', // Pagination Class defined
    paginationClickable: true, // Making pagination dots clicable
    spaceBetween: 30,// Space between each Item
    autoplay: 1000,
    margin: 25,
    nav: true,
    nextButton: '.prev-slide', // Class for next button
    prevButton: '.next-slide', // Class for prev button
    /* navText: ["<div class='nav-btn prev-slide'></div>", "<div class='nav-btn next-slide'></div>"], */
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: true
      },
      600: {
        items: 2,
        nav: true
      },
      1000: {
        items: 3,
        nav: true,
        loop: true
      },
      1500: {
        items: 3,
        nav: true,
        loop: true
      }
    }
  }
  images:any = [];

  /* Date pickers proprty */ // formate date 09/19/2019
  displayMonths = 2;
  showWeekNumbers = false;
  outsideDays = 'visible';
  departureDate: any;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() + 1 };
  // disabledDates: NgbDateStruct[] = new Array(); //this is array of date objects, which i want to disable
  // isDisabled: (date: NgbDateStruct, current: { month: number; year: number; }) => boolean;

  // auto complete
  public departure: any;
  public arrival: any;
  formatter:any //= (x: { cityCode: string }) => x.cityCode;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.airportsList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  // ALL JSON 
  itinerary =
    {
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
          "journeySeg": [
          ],
          "numJSegs": 0
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
          "numChildren": "0",
          "numAdults": "0",
          "userClassType": "",
          "cityOfOrigin": "",
          "countryOfResidence": ""
        },
        "tripVariables": {
          "tripVar": [
            {
              "name": "taxFactor",
              "value": "EUR~USD~1.296849~1@USD~ARS~4.73~1"
            },
            {
              "name": "fareFactor",
              "value": "USD~ARS~4.73~1"
            },
            {
              "name": "surchargeFactor",
              "value": "USD~ARS~4.73~1"
            },
            {
              "name": "couponTotal",
              "value": "54406 ARS"
            }
          ]
        },
        "taxLadders": {
        },
        "itineraryOrigin": "",
        "sessionKey": JSON.parse(sessionStorage.getItem('sessionKey'))
      }
    };
  flightSearchObject = [];
  createFromItinerary: any;
  createToItinerary: any;
  showError: boolean;
  showBadge: boolean;
  allMessageCode: any = [];
  displayMSG : any = [];
  showitinararyError: string;
  showInfo: boolean;
  sequenceNumber: any;
  calenderErrorIndex: any;
  passengerLabel: string;

  // geolocation
  userCurrentLocation: any;
  // itinerary after available schedule
    // repricing json
    legArray = [];
    surcharge_details: {};
    ArvjournerySegmentDetails: {};
    DptjournerySegmentDetails: {};
    seg_legs: {};
    legDetails = {};
    finalObj = [];
    repriceJSON = {};
    validItinerary: boolean = false;
  selectedFromAirportData: any;
  selectedToAirportData: any;
  paramData: any;
  value: void;
  parm1: void;

    constructor(
      private router: Router, 
      private cityservice: AirportService, 
      private homeservice: HomeService,
      private storeService: StoreService,private route: ActivatedRoute) {
        this.getThemeItineraries();
        this.showCalendarId = -1;
        this.showDepartAirportId = -1;
        this.route.params.subscribe( params => console.log(params) );
          this.route.params.subscribe(params => {
           
          });

    }

  ngOnInit() {
    this.createSearchFields();
    if($(window).innerWidth() < 575){
      this.formatter = (x: { cityCode: string }) => x.cityCode;
    }else{
      this.formatter = (x: { name: string }) => x.name;
    }
    this.travellers.adults = 1;
    this.travellers.child = 0;
    let user_Data = JSON.parse(sessionStorage.getItem('login_details'));
    let user_Account = JSON.parse(sessionStorage.getItem('userAccount'));
    if (user_Data) {
      this.user_details = user_Data.LoginUser;
      $("#loginModal").modal('hide');
    } else if (user_Account) {
      this.user_details = user_Account;
      $("#loginModal").modal('hide');
    }else{
      if(sessionStorage.getItem('loginPopup') == 'true'){
        $("#loginModal").modal('hide');
      }else{
        this.loginModal(5000);
      }
      
    }
  

    this.getuniqueID();
    this.initialiseDefaultValue();
    // all important methods
    this.getMapData();
    this.getLoadMessage();
    this.gettineraryData();
    this.getsessionKey();
    this.updatePassenger();
    this.getLatLong();
    $(function () {
      $(document).on('click', '.number-spinner a', function () {
        var btn = $(this),
          input = btn.closest('.number-spinner').find('input'),
          total = $('#passengers').val(),
          oldValue = input.val().trim();

        if (btn.attr('data-dir') == 'up') {
          if (oldValue < input.attr('max')) {
            oldValue++;
            total++;
          }
        } else {
          if (oldValue > input.attr('min')) {
            oldValue--;
            total--;
          }
        }
        input.val(oldValue);
        let child = parseInt($('#child').val());
        let adult = parseInt($('#adult').val());
        let totaltraveller = child + adult;
        if((totaltraveller > 9)){
          $('#travellerwarnings').html('<p style="color:red;"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;There is a maximum of 9 travellers.</p>');
        }
        if(child == 0 && adult <= 7){
          $('#travellerwarnings').html('');
        }
        if(((totaltraveller > 7) && (totaltraveller < 10))){
          $('#travellerwarnings').html('<i class="fa fa-info-circle"></i>&nbsp;Child fares apply to travellers who are at least 2 years old and no more than 11 years old before completion of the Round-the-world journey. Infants cannot be booked on-line. <br> <i class="fa fa-info-circle"></i>&nbsp;For parties of 8 or more, your flight options will not include American Airlines flights. You can continue your planning and on-line booking process but will not have American Airlines flight options.');
        }
        if(((child == 0) && (adult == 8 || adult == 9))){
          $('#travellerwarnings').html('<i class="fa fa-info-circle"></i>&nbsp;Child fares apply to travellers who are at least 2 years old and no more than 11 years old before completion of the Round-the-world journey. Infants cannot be booked on-line.');
        }
      });
    });

    sessionStorage.removeItem('allFlightResult');
    this.setMaxDate();
  }

  setMaxDate() {
    let d1 = new Date(this.minDate.year + ' ' + this.minDate.month);
    d1.setMonth(d1.getMonth() + 11);
    let d2 = new Date(d1.getFullYear(), d1.getMonth() + 1, 0);
    this.maxDate = { 
      year: d2.getFullYear(), 
      month: d2.getMonth() + 1, 
      day: d2.getDate() 
    };
  }

  dismiss_passengers(){
    this.show = !this.show;
  }
  submit_travellers() {
    this.passengerErrormessageDP = "";
    const numAdults = $('#adult').val();
    const numChildren = $('#child').val(); 
    const sum = Number(numAdults) + Number(numChildren);
    if(sum > 9){
      this.passenger = "";
      this.isTravellersValid = false;
      return;
    }else{
        this.passengerErrormessageDP = "";
        this.numAdults = numAdults;
        this.numChildren = numChildren;
        this.passenger = Number(this.numAdults) + Number(this.numChildren);
        this.isTravellersValid = true;
        this.show = !this.show;
      }
  }
  updatePassenger(){
    return parseInt(this.numAdults) + " Adults  " + parseInt(this.numChildren) + ' children';
  }
  toggle() {
    this.show = !this.show;
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  // create flight search fileds
  createSearchFields() {
    this.searchFlight = [
      {
        id: 1,
        departAirport: '',
        destinationAirport: '',
        departureDate: '',
      },
      {
        id: 2,
        departAirport: '',
        destinationAirport: '',
        departureDate: '',
      },
      {
        id: 3,
        departAirport: '',
        destinationAirport: '',
        departureDate: '',
      }
    ];
    if(this.userCurrentLocation){
      this.searchFlight[0].departAirport = this.userCurrentLocation;
    }
  }

  // add newflight search field to the list
  addFlight() {
    if (this.searchFlight.length < 16) {
      this.searchFlight = [
        ...this.searchFlight,
        {
          id: this.searchFlight.length + 1,
          departAirport: '',
          destinationAirport: '',
          departureDate: null,
        }
      ];
    } else {
      return;
    }
    this.autoUpdateDepartValue(this.searchFlight[this.searchFlight.length - 2].destinationAirport, this.searchFlight.length - 1);
  }
  // Get field name for new flight row
  getFieldName(index: number, name: string) {
    return `${name}${index}`;
  }

  getSegmentName(index: number, name: string) {
    return `${name}${index}`;
  }
  getFieldId(index: number, name: string) {
    return `${name}${index}`;
  }

  // remove row
  removeFlight(id: number) {
    this.searchFlight = this.searchFlight.filter(it => it.id !== id);
    this.itinerary.journey.journeySegList.journeySeg = [];
    this.flightSearchObject.splice(id,1)
      this.manupulateItineraryData( this.searchFlight.length - 2);
  }
  // initialise all passengers, cabin class airlinePreferenceList and image list 
  initialiseDefaultValue() {
    this.passengerList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.cabinClassList = [
      { value: 'ECONOMY', label: 'Economy' },
      { value: 'BUSINESS', label: 'Business' },
      { value: 'FIRST', label: 'First' },
    ];
    this.airlinePreferenceList = [
      {
        label: "American Airlines",
        value: "AA",
        IsPreferred: "True"
      },
      {
        label: "British Airways",
        value: "BA",
        IsPreferred: "True"
      },
      {
        label: "Cathay Pacific",
        value: "CX",
        IsPreferred: "True"
      },
      {
        label: "Finnair",
        value: "AY",
        IsPreferred: "True"
      },
      {
        label: "Iberia",
        value: "IB",
        IsPreferred: "True"
      },
      {
        label: "Japan Airlines",
        value: "JL",
        IsPreferred: "True"
      },
      {
        label: "Malaysia Airlines",
        value: "MH",
        IsPreferred: "True"
      },
      {
        label: "Royal Jordanian Airlines",
        value: "RJ",
        IsPreferred: "True"
      },
      {
        label: "S7 Airlines",
        value: "S7",
        IsPreferred: "True"
      },
      {
        label: "SriLankan Airlines",
        value: "UL",
        IsPreferred: "True"
      },
      {
        label: "Qantas Airways",
        value: "QF",
        IsPreferred: "True"
      },
      {
        label: "Qatar Airways",
        value: "QR",
        IsPreferred: "True"
      },
      {
        label: "LATAM Airlines",
        value: "XL",
        IsPreferred: "False"
      },

    ];
    this.numAdults = 1;
    this.numChildren =0;
    this.cabinClass = 'ECONOMY';
    this.flightPreference = '';
    this.imageList = [
      {
        text: 'Lorem ipsum dolor sit amet, do consectetur adipiscing elit, sed do eiusmod',
        src: 'assets/images/img2.png'
      },
      {
        text: 'Lorem ipsum dolor sit amet, do consectetur adipiscing elit, sed do eiusmod',
        src: 'assets/images/img3.png'
      },
      {
        text: 'Lorem ipsum dolor sit amet, do consectetur adipiscing elit, sed do eiusmod',
        src: 'assets/images/img1.png'
      },
    ];
  }

  // Method to display login modal
  loginModal(num) {
    $("#loginModal").modal('show');
    sessionStorage.setItem('loginPopup', 'true');
    let timer = setTimeout(function() {$('#loginModal').modal('hide');}, num); 
    $(document).on("click",function(){
      clearTimeout(timer);
    });
  }

  // get Unique ID for each and every call
  getuniqueID() {
    this.homeservice.getUniqueToken().subscribe(data => {
      sessionStorage.setItem('UniqueId', data);
    });
  }
  // get Mapdata 
  getMapData() {
    this.homeservice.getMapData().subscribe(data => {
      const cities = data.mapData.cities['city'];
      const stations = data.mapData.stations['station'];
      const station_and_city_list={
        "stations":stations,
        "cities":cities
      }
      sessionStorage.removeItem('station_and_city_list');
      sessionStorage.setItem('station_and_city_list', JSON.stringify(station_and_city_list));
      for (let i = 0; i < stations.length; i++) {
        const citycode = stations[i].cityCode;
        for (let j = 0; j < cities.length; j++) {
          if (citycode === cities[j].cityCode) {
            stations[i].countryCode = cities[j].countryCode;
          }
        }
      }
      this.airportsData = cities.concat(stations);
      this.airportsList = this.airportsData;
      let extraAirports = [];
      for (let i = 0; i < this.airportsData.length; i++) {
        if(this.airportsData[i].staCode){
          let name = this.airportsData[i].name + " (" + this.airportsData[i].cityCode + ")";
          extraAirports.push(name);
          this.airportsList[i]['name'] = this.airportsData[i].name + " (" + this.airportsData[i].staCode + ")";
        }else{
          this.airportsList[i]['name'] = this.airportsData[i].name + " (" + this.airportsData[i].cityCode + ")";
        }
      }
      sessionStorage.setItem('airportList', JSON.stringify(this.airportsList.concat(extraAirports)));
    });
  }
  // get all error messages  
  getLoadMessage() {
    var allMSG = JSON.parse(sessionStorage.getItem("loadMessage"));
    if (allMSG == null) {
      this.homeservice.getLoadMessages().subscribe(data => {
        this.allMessageCode = data['LoadMessages_Output'].messages.message;
        sessionStorage.setItem('loadMessage', JSON.stringify(this.allMessageCode));
      });
    }else{
      this.allMessageCode = JSON.parse(sessionStorage.getItem('loadMessage'));
    }
  }
  // get Mapdata UniqueSessionToken 
  gettineraryData() {
    this.homeservice.geItineraryData().subscribe(data => {
    });
  }
  // get client session key 
  getsessionKey() {
    this.homeservice.getSessionKey().subscribe(data => {
      sessionStorage.setItem('sessionKey', JSON.stringify(data['clientsession']));
    });
  }
  // get session Tracker 
  getsessionTracker() {
    this.homeservice.getSessionTracker(this.itinerary).subscribe(data => {
    });
  }
  // redirect to old rtw to select airport on Map
  goToMap() {
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    //return [year, month, day].join('-');
    date  = {
      month: month,day : day,year : year}
      return date;
}

  /* all datepicker methods  */
  onDateSelection(events, departAirport, destinationAirport, index, departureDate) {
    let event = this.formatDate(events);
    this.showCalendarId = -1;
    this.searchFlight[index].departureDate = events;

    /* start appending value in flight search  */
      const newOBJ = {
        "GetAvailableSchedules_Input": {
          "customerCode": "ONWIBE2",
          "customerSubCode": "OERTW",
          "productCode": "ONWRTWIBE",
          "mode": "BOOK",
          "lang": "",
          "amadeusClassInfoLevel": "",
          "pageNumber": 1,
          "isParallel": "ENABLED",
          "dptCode": departAirport.cityCode,
          "dptCodeType": "CTY",
          "arvCode": destinationAirport.cityCode,
          "arvCodeType": "CTY",
          "MM": event.month < 10 ? '0' + event.month : event.month,
          "DD": event.day < 10 ? '0' + event.day : event.day,
          "YYYY": event.year,
          "cnxType": "B",
          "searchType": "B",
          "numberOfPassengers": Number(this.numAdults) + Number(this.numChildren),
          "isFirstSegment": "",
          "countryOfResidence": "",
          "selectedSequenceNumber": 0,
          "minBookDays": "3",
          "travelInfo": {},
          "itinerary": {},
          "flightPreference": this.flightPreference,
          "timePreference": "",
          "whiteLabelledCode": "",
          "firstSegCarrierCode": ""
        }
      };
      
      this.flightSearchObject[index] = newOBJ;
    
    for (let i = 0; i < this.flightSearchObject.length; i++) {
      this.flightSearchObject[i].GetAvailableSchedules_Input['selectedSequenceNumber'] = i + 1;
      if (i === 0) {
        this.flightSearchObject[i].GetAvailableSchedules_Input['isFirstSegment'] = 'true';
      } else {
        this.flightSearchObject[i].GetAvailableSchedules_Input['isFirstSegment'] = 'false';
      }
    }

    /* end here */
  }
  onNavigate(event) {
  }

  getCalenderValue(departAirport, destinationAirport, departureDate, index, event) {
    if (departAirport.cityCode && destinationAirport.cityCode) {

      if (this.showCalendarId == index) {
        this.showCalendarId = -1;
        return;
      } else {
        this.showCalendarId = index;
      }
      
      let beginYYYY = this.minDate.year;
      let beginMM = this.minDate.month;
      let beginDD = this.minDate.day;
      let endYYYY = this.maxDate.year;
      let endMM = this.maxDate.month;
      let endDD = this.maxDate.day;
      for (let i = 0; i < this.searchFlight.length; i++) {
        if (this.searchFlight[i].departureDate != '') {
          let dt = new Date(this.searchFlight[i].departureDate);
          if (i < index) {
            beginYYYY = dt.getFullYear();
            beginMM = dt.getMonth() + 1;
            beginDD = dt.getDate(); 
          }
          if (i > index) {
            endYYYY = dt.getFullYear();
            endMM = dt.getMonth() + 1;
            endDD = dt.getDate(); 
            break;
          }
        }
      }

      this.showError = false;
      this.calenderErrorIndex = '';
      const calenderObj = {
        "GetRouteCalendar_Input": {
          "customerCode": "ONWIBE2",
          "dptCode": departAirport.cityCode,
          "dptCodeType": "CTY",
          "arvCode": destinationAirport.cityCode,
          "arvCodeType": "CTY",
          "beginDateMM": beginMM,
          "beginDateDD": beginDD,
          "beginDateYYYY": beginYYYY,
          "endDateMM": endMM,
          "endDateDD": endDD,
          "endDateYYYY": endYYYY
        }
      }
      this.loadingCalendar = true;
      this.homeservice.getRouteCalendar(calenderObj).subscribe((data: any) => {
        
        if (data.GetRouteCalendar_Output && data.GetRouteCalendar_Output.date) {
          this.storeService.setCalendarData(data.GetRouteCalendar_Output.date);
          
        } else {
          this.storeService.setCalendarData([]);
        }
        this.loadingCalendar = false;
      }, error => {
        alert(error.error);
        this.loadingCalendar = false;
        this.showCalendarId = -1;
      });
    } else {
      this.calenderErrorIndex = index;
      this.showError = true;
    }
  }

  setDataQueryParm(){
    if(this.selectedFromAirportData && this.selectedToAirportData){
      this.router.navigate([''], { queryParams: { slectedAir: this.selectedFromAirportData, 'toAir':  this.selectedToAirportData } });

    }
  }

  // auto complete methods
  selectedFromAirport($event, input, i) {
    const clickedItem = $event.item;
    this.selectedFromAirportData= clickedItem.name;
    console.log(this.selectedFromAirportData)
    this.setDataQueryParm()

  }
  selectedToAirport(item, id) {
    const clickedItem = item.item;
    this.selectedToAirportData=clickedItem.name;
    console.log(this.selectedToAirportData)
    this.setDataQueryParm()
    this.searchFlight[id].destinationAirport = clickedItem;
    this.itinerary.journey.journeySegList.journeySeg = [];
    if(this.searchFlight[id].departAirport['cityCode']){
      this.manupulateItineraryData(id);  // add value in itinerary to check valid/invalid
      this.checkValidItinerary();
    } else{
      alert('Please select departure city or airport');
    }

  }
  // call api to check segment is valid or not
  checkValidItinerary() {
    this.itinerarySegmenterrs = [];
    this.itineraryErrMsgLists = [];
    this.homeservice.getItinerary(this.itinerary).subscribe(data => {
      if(data) {
        const newdata = data['journey'].journeySegList.journeySeg;
        if (newdata && newdata.length > 0) {
          const segmentErrorsList = [];
          for (let i = 0; i < newdata.length; i++) {
            if (newdata[i].segStatus === 'invalid') {
              /* this.isDisableSearch = true; */
              //this.sequenceNumber = newdata[i].sequenceNumber;
              let sequenceNumber = newdata[i].sequenceNumber
              //this.displayMSG = [];
              let errMsgs = [];
              this.showBadge = true;
              const warningMSG = newdata[i].journeySegWarnings.journeySegWarning;
  
              for (let k = 0; k < warningMSG.length; k++) {
                const code = warningMSG[k].code;
  
                for (let j = 0; j < this.allMessageCode.length; j++) {
                  if (this.allMessageCode[j].code === code) {
                    const newError = this.allMessageCode[j].extendedText;
                    errMsgs.push(newError);
                  }
                }
              }
              const errObj = {
                sequenceNumber : sequenceNumber,
                ErrorMessages : errMsgs
              };
              segmentErrorsList.push(errObj);
              this.itinerarySegmenterrs = segmentErrorsList;
            } else {
              /* this.isDisableSearch = false; */
              this.showBadge = false;
            }
          }
        }

        if(data['journey'].journeySummary.journeyWarnings){
          let itineraryErr = data['journey'].journeySummary.journeyWarnings.journeyWarning;
        if(itineraryErr && itineraryErr.length > 0){
          const itineraryErrMsgList = [];
          for(var l = 0; l < itineraryErr.length; l++){
            const Errcode = itineraryErr[l].code;

            for (let j = 0; j < this.allMessageCode.length; j++) {
              if (this.allMessageCode[j].code === Errcode) {
                const newItiError = this.allMessageCode[j].extendedText;
              itineraryErrMsgList.push(newItiError);
              }
            }

          }
          this.itineraryErrMsgLists = itineraryErrMsgList;
        }
        }
      }
    }, error => {
      /* this.isDisableSearch = true; */
      alert(error.error);
    });
  }
  // mnupulate data before sending
  manupulateItineraryData(id) {
    for (let i = 0; i < this.searchFlight.length; i++) {
      if(this.searchFlight[i].departAirport['cityCode'] && this.searchFlight[i].destinationAirport['cityCode']){
        this.createFromItinerary = {
          "dptCity": this.searchFlight[i].departAirport['cityCode'],
          "dptMetro": "",
          "dptCntry": this.searchFlight[i].departAirport['countryCode'],
        };
        this.createToItinerary = {
          "arvCity": this.searchFlight[i].destinationAirport['cityCode'],
          "arvMetro": "",
          "arvCntry": this.searchFlight[i].destinationAirport['countryCode'],
          "dayIndicator": 0,
          "typeSeg": "FLIGHT",
          "sequenceNumber": i + 1
        }
        this.createToItinerary = Object.assign(this.createFromItinerary, this.createToItinerary);
        this.itinerary.journey.journeySegList.journeySeg['journeySeg'] = this.itinerary.journey.journeySegList.journeySeg.push(this.createToItinerary);
      }
      
    }
    this.itinerary.journey.travelInfo = {
      "numInfants": parseInt('0'),
      "numChildren": this.numChildren,
      "numAdults": this.numAdults,
      "userClassType": this.cabinClass,
      "cityOfOrigin": this.searchFlight[0].departAirport['cityCode'],
      "countryOfResidence": "",
    };
    //suggested cities //onwardRef
    for (let i = 0; i < this.searchFlight.length; i++) {
      if(this.searchFlight[i].departAirport['cityCode'] && this.searchFlight[i].destinationAirport['cityCode']){
          this.itinerary.journey.journeySegList.journeySeg[i].onwardRef = 'arvCity';
      }
    }
    this.itinerary.journey.journeySegList.numJSegs = this.itinerary.journey.journeySegList.journeySeg.length;
  }

  reupdateflightSearchDeatils(){
    const newitinerary = this.itinerary;
    let updatedFlightsdata;
      for (let i = 0; i < this.searchFlight.length; i++) {
        const nDate = this.searchFlight[i].departureDate;
        let formDate = new Date(nDate);
        //const formatDate = (nDate.month < 10 ? '0' + nDate.month : nDate.month) + '/' + (nDate.day < 10 ? '0' + nDate.day : nDate.day) + '/' + nDate.year;
        newitinerary.journey.journeySegList.journeySeg[i].dptDate = nDate;
        if (i === (this.searchFlight.length - 1)) {
          newitinerary.journey.journeySegList.journeySeg[i].onwardRef = 'arvCity';
        }
        /* this.flightSearchObject[i].GetAvailableSchedules_Input.travelInfo = this.itinerary.journey.travelInfo;
        this.flightSearchObject[i].GetAvailableSchedules_Input.itinerary = newitinerary; */
        const newOBJ = {
          "GetAvailableSchedules_Input": {
            "customerCode": "ONWIBE2",
            "customerSubCode": "OERTW",
            "productCode": "ONWRTWIBE",
            "mode": "BOOK",
            "lang": "",
            "amadeusClassInfoLevel": "",
            "pageNumber": 1,
            "isParallel": "ENABLED",
            "dptCode": this.searchFlight[i].departAirport['cityCode'],
            "dptCodeType": "CTY",
            "arvCode": this.searchFlight[i].destinationAirport['cityCode'],
            "arvCodeType": "CTY",
            /* "MM": this.searchFlight[i].departureDate.month < 10 ? '0' + this.searchFlight[i].departureDate.month : this.searchFlight[i].departureDate.month,
            "DD": this.searchFlight[i].departureDate.day < 10 ? '0' + this.searchFlight[i].departureDate.day : this.searchFlight[i].departureDate.day,
            "YYYY": this.searchFlight[i].departureDate.year, */
            "MM": this.formatDate(this.searchFlight[i].departureDate).month,
            "DD": this.formatDate(this.searchFlight[i].departureDate).day,
            "YYYY": this.formatDate(this.searchFlight[i].departureDate).year,
            "cnxType": "B",
            "searchType": "B",
            "numberOfPassengers": Number(this.numAdults) + Number(this.numChildren),
            "isFirstSegment": "",
            "countryOfResidence": "",
            "selectedSequenceNumber": 0,
            "minBookDays": "3",
            "travelInfo": {},
            "itinerary": {},
            "flightPreference": this.flightPreference,
            "timePreference": "",
            "whiteLabelledCode": "",
            "firstSegCarrierCode": ""
          }
        };
        
      this.flightSearchObject[i] = newOBJ;
      this.flightSearchObject[i].GetAvailableSchedules_Input.travelInfo = this.itinerary.journey.travelInfo;
        this.flightSearchObject[i].GetAvailableSchedules_Input.itinerary = newitinerary;

      }

      for (let i = 0; i < this.flightSearchObject.length; i++) {
        this.flightSearchObject[i].GetAvailableSchedules_Input['selectedSequenceNumber'] = i + 1;
        if (i === 0) {
          this.flightSearchObject[i].GetAvailableSchedules_Input['isFirstSegment'] = 'true';
        } else {
          this.flightSearchObject[i].GetAvailableSchedules_Input['isFirstSegment'] = 'false';
        }
      }
      updatedFlightsdata = this.flightSearchObject;
      /*  JSON for flight search */
      /* for (let i = 0; i < this.flightSearchObject.length; i++) {
        this.flightSearchObject[i].GetAvailableSchedules_Input.travelInfo = this.itinerary.journey.travelInfo;
        this.flightSearchObject[i].GetAvailableSchedules_Input.itinerary = newitinerary;
      } */
      /* end here  */
      return updatedFlightsdata;
  }

  // search flight 
  searchFlightDetails() {
    this.isEnableItinerarysearch = false;
    const segLength = this.searchFlight.length;
    for(var i = 0; i < segLength; i++){
      var val = $(`input[name=${'FlightSegment' + i}]`).val();
      if(val == 'false'){
        this.isEnableItinerarysearch = true;
        return false;
      }
    }
    if(((parseInt(this.numAdults) + parseInt(this.numChildren)) > 9)){
      alert('There is a maximum of 9 travellers.');
      return false;
    }
    this.isEnableItinerarysearch = false;
    this.showMask = true;
    const len = this.searchFlight.length;
    this.passengerChanged();
    this.cabinChanged();
    this.airlinePreferenceChanged();

    this.showInfo = false;
    if(this.itinerary.journey.journeySegList.journeySeg.length >= 3){

      this.checkValidItinerary();
      
      let updatedflightData = this.reupdateflightSearchDeatils();
      sessionStorage.setItem('no_of_passenger', JSON.stringify({'numAdults': this.numAdults, 'numChildren': this.numChildren,'total_no_of_passenger':Number(this.numAdults) + Number(this.numChildren)}));
      this.getsessionTracker();
      this.homeservice.getAvailableSchedules(updatedflightData).subscribe(data => {
        //this.flightSearchObject = [];
        this.showMask = false;
        // clear passenger values
        this.initialiseDefaultValue();
        if(data['FlightsResponse']){
          if(data['FlightsResponse'].flightResults[0].flights.count >0) {
            const flightRes = data['FlightsResponse'].flightResults;
          sessionStorage.setItem('allFlightResult', JSON.stringify(flightRes));
          this.itineraryAfterAvailableSchedule(flightRes); // if valid itinerary
          //  if(this.validItinerary) {
            if(data['AccuratePriceQuoteResponse'] !== null ) {
              const flightPrice = data['AccuratePriceQuoteResponse'].GetAccuratePriceQuote_Output;
              sessionStorage.setItem('FlightPrice', JSON.stringify(flightPrice));
            }
              this.router.navigate(['/choose-flight']);
          //  } else {
          //   alert(JSON.parse(this.displayMSG));
          // }
          } else if(data['FlightsResponse'].flightResults[0].flights.count == 0){
          alert(data['FlightsResponse'].flightResults[0].error);
          }
        } else {
          const count = data['flightResults'].flights.count;
          alert(data['flightResults'].error);
        }
      }, error => {
        this.showMask = false;
        alert(error.error);
      });
    } else{
      this.showMask = false;
      alert('Select all itinerary');
    }
  }
  // append all value in one array to get flight result
  searchObject(){
  }

  // update next field value with previous filled value
  autoUpdateDepartValue(value, id) {
    //if(this.searchFlight.length - 2) {
      this.searchFlight[id].departAirport = value;
    //}
  }
  // update next field value with previous filled value
  autoUpdateDestinationValue(value, id) {
    if(this.searchFlight.length - 2) {
      if(this.searchFlight[id + 1].departAirport != "undefined"){
        this.searchFlight[id + 1].departAirport = value;
      }
    }
  }
  // update last field value with previous filled value
  finishItinerary() {
    const len = this.searchFlight.length;
    this.searchFlight[len - 1].destinationAirport = this.searchFlight[0].departAirport;
    this.itinerary.journey.journeySegList.journeySeg = [];
    this.manupulateItineraryData(len - 1);  // add value in itinerary to check valid/invalid
    this.checkValidItinerary();
  }
  // call when passenger value change
  passengerChanged() {
    for (let i = 0; i < this.flightSearchObject.length; i++) {
      this.flightSearchObject[i].GetAvailableSchedules_Input['numberOfPassengers'] = Number(this.numAdults) + Number(this.numChildren);
    }
    this.itinerary.journey.travelInfo.numAdults = this.numAdults;
  }
  // when cabin class value change
  cabinChanged() {
    this.itinerary.journey.travelInfo.userClassType = this.cabinClass;
  }
  // when airlinr preference value change
  airlinePreferenceChanged() {
    // console.log(this.flightPreference);
  }

  // clear all filled flight data
  removeAllFlight() {
    this.createSearchFields();
    this.itinerary.journey.journeySegList.journeySeg = [];
    this.flightSearchObject = [];
    this.itinerarySegmenterrs = [];
    this.itineraryErrMsgLists = [];
    this.showBadge = false;
  }
  minusAdult(sum){
    if(sum > 1){
      this.numAdults = this.numAdults -1;
      return this.numAdults;
    }
  }
  addAdult(sum){
    if(sum < 9){
      this.numAdults = this.numAdults +1;
      return this.numAdults;
    }
  }
  minusChildren(noChildren){
    if(noChildren > 0){
      this.numChildren = this.numChildren -1;
      return this.numChildren;
    }
  }
  addChildren(noChildren){
    if(noChildren < 4){
      this.numChildren = this.numChildren +1;
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
    let child = parseInt(numChildren);
    let adult = parseInt(numAdults);
    let totaltraveller = child + adult;
    if((totaltraveller > 9)){
      $('#travellerwarnings_mb').html('<p style="color:red;"><i class="fa fa-info-circle"></i>&nbsp;There is a maximum of 9 travellers.</p>');
    }
    if(child == 0 && adult <= 7){
      $('#travellerwarnings_mb').html('');
    }
    if(((totaltraveller > 7) && (totaltraveller < 10))){
      $('#travellerwarnings_mb').html('<p><i class="fa fa-info-circle"></i>&nbsp;Child fares apply to travellers who are at least 2 years old and no more than 11 years old before completion of the Round-the-world journey. Infants cannot be booked on-line. <br> <i class="fa fa-info-circle"></i>&nbsp;For parties of 8 or more, your flight options will not include American Airlines flights. You can continue your planning and on-line booking process but will not have American Airlines flight options.</p>');
    }
    if(((child == 0) && (adult == 8 || adult == 9))){
      $('#travellerwarnings_mb').html('<p><i class="fa fa-info-circle"></i>&nbsp;Child fares apply to travellers who are at least 2 years old and no more than 11 years old before completion of the Round-the-world journey. Infants cannot be booked on-line.</p>');
    }
    if(sum > 9){
      this.passengerErrormessage = 'Total passengers should be less than 9';
      this.isTravellersValid = false;
    }else{
        this.isTravellersValid = true;
        this.passengerErrormessage = "";
        this.passengerLabel = parseInt(this.numAdults) + ' Adults ' + parseInt(this.numChildren) + ' Children ' + ', ' + this.cabinClass;
      }
      return this.passengerLabel;
  }

  // Geolocation get user current location from API
  toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    return ('0' + degrees).slice(-2) + "" + ('0' + minutes).slice(-2) + "" + ('0' + seconds).slice(-2);
  }

  getLatLong(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          var latitude = this.toDegreesMinutesAndSeconds(this.lat);
          var latitudeCardinal = this.lat >= 0 ? "N" : "S";

          var longitude = this.toDegreesMinutesAndSeconds(this.lng);
          var longitudeCardinal = this.lng >= 0 ? "E" : "W";

          let geoObj = {
            longitude : longitude + longitudeCardinal,
            latitude : latitude + latitudeCardinal
          }

          this.homeservice.getGeolocation(geoObj).subscribe(data=>{
            if(data){
             const citycode = data['cityCode'];
             this.userCurrentLocation = this.getAirportName(citycode);
             this.createSearchFields();
            }
          }),error => {
            this.createSearchFields();
          }
        }
      },
        (error: PositionError) => {
          console.log(error);
          this.createSearchFields();
        });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  // get airport city name
  getAirportName(cityCode) {
    const list = JSON.parse(sessionStorage.getItem('airportList'));
    if(list){
      for (let i = 0; i < list.length; i++) {
        if (list[i].cityCode === cityCode) {
          return list[i];
        }
      }
    }
  }
//check if field in not valid
  updateDesti(val){
    const list = JSON.parse(sessionStorage.getItem('airportList'));
    let ifValid = true;
    for(var i = 0; i < list.length; i++){
      if(list[i].name == val.value){
        ifValid = true;
        break;
      }else{
        ifValid = false;
      }
    }
    if(ifValid == false){
      $(`#${val.id}+.error-layout`).html('please provide valid field');
    }else if(ifValid == true){
      $(`#${val.id}+.error-layout`).html('');
    }
  }

  updateDepart(val){
    const list = JSON.parse(sessionStorage.getItem('airportList'));
    for(var i = 0; i < list.length; i++){
      if(list[i].name == val.value){
        this.isAllAirportsValid = true;
        break;
      }else{
        this.isAllAirportsValid = false;
      }
    }
    if(this.isAllAirportsValid == false){
      $(`#${val.id}+.error-layout`).html('please provide valid field');
    }else if(this.isAllAirportsValid == true){
      $(`#${val.id}+.error-layout`).html('');
    }
  }

  //themeItineraries section
  getThemeItineraries(){
    this.homeservice.ThemeItineraries().subscribe(data => {
      this.images = data;
    })
  }
  // call after available schedule to check itinerary 
  itineraryAfterAvailableSchedule(flightRes) {
    let allFlightResponse = flightRes;
    for (let i = 0; i < flightRes.length; i++) {
      for (let j = i + 1; j < flightRes.length; j++) {
        if (allFlightResponse[i].sequenceNumber > allFlightResponse[j].sequenceNumber) {
          const obj = allFlightResponse[i];
          allFlightResponse[i] = allFlightResponse[j];
          allFlightResponse[j] = obj;
        }
      }
    }
    const allFirstIndexFlight = []; // all segment flight at 0 index
    for (let i = 0; i < allFlightResponse.length; i++) {
      allFirstIndexFlight[i] = flightRes[i].flights.flight[0];
    }
  this.generateJSON(allFirstIndexFlight);

  this.homeservice.getItinerary(this.repriceJSON).subscribe(data => {
    if(data) {
      this.repriceJSON = {};
      this.finalObj = [];
      const newdata = data['journey'].journeySegList.journeySeg;
      sessionStorage.setItem('ItineraryDetailsAfterAvaiSchedules', JSON.stringify(data['journey']));
      if (newdata.length > 0) {
        for (let i = 0; i < newdata.length; i++) {
          if (newdata[i].segStatus === 'invalid') {
           this.sequenceNumber = newdata[i].sequenceNumber;
            this.displayMSG = [];
             this.showBadge = true;
            const warningMSG = newdata[i].journeySegWarnings.journeySegWarning;
            for (let k = 0; k < warningMSG.length; k++) {
              const code = warningMSG[k].code;
              for (let j = 0; j < this.allMessageCode.length; j++) {
                if (this.allMessageCode[j].code === code) {
                  const newError = this.allMessageCode[j].extendedText;
                  this.displayMSG[k] = newError;
                }
              }
            }
          this.validItinerary = false;
          } else {
            this.validItinerary = true;
          }
        }
      }

    }
  }, error => {
   alert(error.error);
  });

  }
  // generate itinerary JSON
  generateJSON(allFirstIndexFlight) {
    //collect selected flight details
    for (let i = 0; i < allFirstIndexFlight.length; i++) {

      this.legArray = [];
      for (let j = 0; j < allFirstIndexFlight[i].legs.leg.length; j++) {
        if (!allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].surcharge) {
          this.surcharge_details;
        } else {
          this.surcharge_details =
          allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].surcharge;
        }
        const leg = {
          "dptCity": allFirstIndexFlight[i].legs.leg[j].dpt.cityCode,
          "dptCntry": allFirstIndexFlight[i].legs.leg[j].dpt.country,
          "dptDD": allFirstIndexFlight[i].legs.leg[j].legDepartureDate.dd,
          "dptMM": allFirstIndexFlight[i].legs.leg[j].legDepartureDate.mm,
          "dptYYYY": allFirstIndexFlight[i].legs.leg[j].legDepartureDate.yyyy,
          "dptRegion": "",
          "dptStation": allFirstIndexFlight[i].legs.leg[j].dpt.aptCode,
          "dptTerm": allFirstIndexFlight[i].legs.leg[j].dpt.terminal,
          "dptTimeLocal": allFirstIndexFlight[i].legs.leg[j].dptTime,
          "arvCity": allFirstIndexFlight[i].legs.leg[j].arv.cityCode,
          "arvCntry": allFirstIndexFlight[i].legs.leg[j].arv.country,
          "bookingNote": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].bookingNote,
          "arvDD": allFirstIndexFlight[i].legs.leg[j].legArriveDate.dd,
          "arvMM": allFirstIndexFlight[i].legs.leg[j].legArriveDate.mm,
          "arvYYYY": allFirstIndexFlight[i].legs.leg[j].legArriveDate.yyyy,
          "carCode": allFirstIndexFlight[i].legs.leg[j].carCode,
          "arvRegion": "",
          "arvStation": allFirstIndexFlight[i].legs.leg[j].arv.aptCode,
          "arvTerm": allFirstIndexFlight[i].legs.leg[j].arv.terminal,
          "arvTimeLocal": allFirstIndexFlight[i].legs.leg[j].arvTime,
          "changeOfEquip": allFirstIndexFlight[i].legs.leg[j].changeOfEquip,
          "equipCode": allFirstIndexFlight[i].legs.leg[j].dpt.terminal,
          "codeShare": allFirstIndexFlight[i].legs.leg[j].codeShare,
          "dayIndicator": allFirstIndexFlight[i].legs.leg[j].legDayIndicator,
          "flightMinutes": allFirstIndexFlight[i].legs.leg[j].flightMinutes,
          "flightNumber": allFirstIndexFlight[i].legs.leg[j].flightNumber,
          "layoverMinutes": allFirstIndexFlight[i].legs.leg[j].layoverMinutes,
          "legMiles": allFirstIndexFlight[i].legs.leg[j].legMiles,
          "number": allFirstIndexFlight[i].legs.leg[j].number,
          "operatedBy": "",
          "restrictionCode": allFirstIndexFlight[i].legs.leg[j].restrictionCode,
          "stopCodes": allFirstIndexFlight[i].legs.leg[j].stopCodes,
          "stops": allFirstIndexFlight[i].legs.leg[j].stops,
          "wetLease": allFirstIndexFlight[i].legs.leg[j].wetLease,
          "userClassType": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].userClassType,
          "amadeusClassCode": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].amadeusClassCode,
          "class": {
            "amadeusClassCode": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].amadeusClassCode,
            "availableSeats": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].availableSeats,
            "bookingNote": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].bookingNote,
            "surcharge": this.surcharge_details,

            "udCabinClass": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].udCabinClass,
            "udIndicator": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].udIndicator,
            "userClassType": allFirstIndexFlight[i].legs.leg[j].classAndAvailability.class[0].userClassType,
          },
          "dptCityName": allFirstIndexFlight[i].legs.leg[j].dpt.cityCode,
          "arvCityName": allFirstIndexFlight[i].legs.leg[j].arv.cityCode,
          "isPremiumEconomy": false
        }
        this.legArray = [...this.legArray, leg];
        if (j == allFirstIndexFlight[i].legs.leg.length - 1) {
          this.ArvjournerySegmentDetails = {
            "arvCity": allFirstIndexFlight[i].legs.leg[j].arv.cityCode,
            "arvMetro": "",
            "arvCntry": allFirstIndexFlight[i].legs.leg[j].arv.country,
            "arvDate": allFirstIndexFlight[i].legs.leg[j].legArriveDate.mm + "/" + allFirstIndexFlight[i].legs.leg[j].legArriveDate.dd + "/" + allFirstIndexFlight[i].legs.leg[j].legArriveDate.yyyy,
            "typeSeg": "FLIGHT",
            "dayIndicator": +allFirstIndexFlight[i].dayIndicator,
          }
        }
        if (j == 0) {
          this.DptjournerySegmentDetails = {
            "sequenceNumber": i + 1,
            "dptCity": allFirstIndexFlight[i].legs.leg[j].dpt.cityCode,
            "dptMetro": "",
            "dptCntry": allFirstIndexFlight[i].legs.leg[j].dpt.country,
            "dptDate": allFirstIndexFlight[i].legs.leg[j].legDepartureDate.mm + "/" + allFirstIndexFlight[i].legs.leg[j].legDepartureDate.dd + "/" + allFirstIndexFlight[i].legs.leg[j].legDepartureDate.yyyy,
          }
        }
        this.seg_legs = {
          "segLegs": {
            "flightIsAvailable": "true",
            "numLegs": allFirstIndexFlight[i].legs.leg.length,
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
          "numJSegs": allFirstIndexFlight.length,
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
          "numChildren": "0",
          "numAdults": "1",
          "userClassType": allFirstIndexFlight[0].classAndAvailability.class[0].amadeusClassCode,
          "cityOfOrigin": allFirstIndexFlight[0].dpt.cityCode,
          "countryOfResidence": ""
        },
        "tripVariables": {
          "tripVar": [
            {
              "name": "taxFactor",
              "value": "EUR~USD~1.296849~1@USD~ARS~4.73~1"
            },
            {
              "name": "fareFactor",
              "value": "USD~ARS~4.73~1"
            },
            {
              "name": "surchargeFactor",
              "value": "USD~ARS~4.73~1"
            },
            {
              "name": "couponTotal",
              "value": "54406 ARS"
            }
          ]
        },
        "taxLadders": {
        },
        "itineraryOrigin": "",
        "sessionKey": JSON.parse(sessionStorage.getItem('sessionKey')),
        "firstSegCarrier": allFirstIndexFlight[0].carrierCode
      }
    };
  }

  selDepartDate(event, ind) {
    this.showCalendarId = -1;
    this.searchFlight[ind].departureDate = event;
  }

  selectDepartAirport(ind) {
    this.showDepartAirportId = this.showDepartAirportId == ind ? -1 : ind;
  }
}
