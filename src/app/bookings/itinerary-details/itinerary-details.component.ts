import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,AbstractControl,FormControl, CheckboxRequiredValidator,FormArray} from "@angular/forms";
import { FlightService } from '../../Service/flight.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itinerary-details',
  templateUrl: './itinerary-details.component.html',
  styleUrls: ['./itinerary-details.component.less']
})
export class ItineraryDetailsComponent implements OnInit {
  showMask:boolean = false;
  passenger_list=3;
  list_of_passenger=Array;
  paymentInfoForm:FormGroup;
  submitted: boolean=false;
  passengersList: any;
  contactInfo: any;
  flightResponse: any;
  airportList: any;
  selectedFlightIndex: any;
  showDetail: boolean;
  clientSessionKey:any;
  countries_details:any;
  bk:any;
  finalObj=[];
  ArvjournerySegmentDetails:{};
  DptjournerySegmentDetails:{};
  seg_legs:{};
  legDetails={};
  legArray =[];
  travelers_list={};
  travelers_array=[];
  FlightPrice: any;
  month_list=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  month_list_number={'jan':'01','Feb':'02','Mar':'03','Apr':'04','May':'05','Jun':'06','Jul':'07','Aug':'08','Sep':'09','Oct':'10','Nov':'11','Dec':'12'}
  current_year=new Date().getFullYear();
  year_list=[];
  payment_Details={};
  surcharge_details:{};
  fop_status:any;
  frequent_flyer_details:any;
  isFOPRequired:boolean;
  price:any;
  totalBasePrice:any;
  totalTax:any;
  totalAmount:any;
  total_no_of_passenger: any;
  passenger_details: any;
  showPaymentFields: boolean=false;
  maxCardNumber: number;
  cvvNumberLength: number=3;
  contact_Information: {};
  station_and_city_list: any={};
  constructor(private formBuilder: FormBuilder, private flightService: FlightService,private router: Router) {}
  ngOnInit() {
    this.passengersList = JSON.parse(sessionStorage.getItem('travelers_details'));
    this.contactInfo = JSON.parse(sessionStorage.getItem('contact_details'));
    this.flightResponse = JSON.parse(sessionStorage.getItem('selectedFlightRes'));
    this.airportList = JSON.parse(sessionStorage.getItem('airportList'));
    this.clientSessionKey = JSON.parse(sessionStorage.getItem('sessionKey'));
    this.FlightPrice = JSON.parse(sessionStorage.getItem('FlightPrice'))
    this.station_and_city_list = JSON.parse(sessionStorage.getItem('station_and_city_list'));
 /*    this.total_no_of_passenger = JSON.parse(sessionStorage.getItem('number_of_passengers')) */
 this.passenger_details= JSON.parse(sessionStorage.getItem('no_of_passenger'));
    this.paymentInfoForm = this.formBuilder.group({
      cardType: [""],
      cardNumber: [""],
      expirationMonth: [""],
      expirationYear: [""],
      cvvNumber:[""],
      cardholderName: [""],
      address1: [""],
      pincode: [""],
      city: [""],
      state: [""],
      country: [""],
      address2: [""],
      tc1: [false,[Validators.requiredTrue]],
      tc2: [false,[Validators.requiredTrue]],
      });
      if(this.flightResponse[0].legs.leg[0].carCode==='CX' || this.flightResponse[0].legs.leg[0].carCode==='AY' || this.flightResponse[0].legs.leg[0].carCode==='IB' || this.flightResponse[0].legs.leg[0].carCode==='QF'){
        this.updateCardDetailsValidator();
      }
    //Call get countries code API
    let language={"language":"EN"}
    this.flightService.getCountries(language).subscribe(data => {
      this.countries_details=data;
    });
    
    //Call  getCarrierFOPStatus  method
    this.flightService.getCarrierFOPStatus().subscribe(data => {
      this.fop_status=data;
     for(let i=0; i<this.fop_status.length;i++){
       if(this.fop_status[0].CarrierCode===this.flightResponse[0].legs.leg[0].carCode || this.fop_status[0].CarrierCode===this.flightResponse[0].legs.leg[0].carCode || this.fop_status[0].CarrierCode===this.flightResponse[0].legs.leg[0].carCode || this.fop_status[0].CarrierCode===this.flightResponse[0].legs.leg[0].carCode){
        this.isFOPRequired=this.fop_status[0].FOPEnabledFlag;
       }else{
        this.isFOPRequired=this.fop_status[0].FOPEnabledFlag;
       }
      }
    });
    //Credit card expiration year
    for(let i=0 ;i<=11;i++){
      this.year_list.push(this.current_year+i);
    }
    //collect selected flight details
    for(let i=0 ; i<this.flightResponse.length; i++){
  
      this.legArray=[];
     for(let j=0; j<this.flightResponse[i].legs.leg.length; j++)
      {
      if(!this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].surcharge)
      {
        this.surcharge_details;
      }else{
        this.surcharge_details=
         this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].surcharge;
      }
        const leg = {
          "dptCity": this.flightResponse[i].legs.leg[j].dpt.cityCode,
          "dptCntry": this.flightResponse[i].legs.leg[j].dpt.country,
          "dptDD": this.flightResponse[i].legs.leg[j].legDepartureDate.dd,
          "dptMM": this.flightResponse[i].legs.leg[j].legDepartureDate.mm,
          "dptYYYY": this.flightResponse[i].legs.leg[j].legDepartureDate.yyyy,
          "dptRegion": "",
          "dptStation": this.flightResponse[i].legs.leg[j].dpt.aptCode,
          "dptTerm": this.flightResponse[i].legs.leg[j].dpt.terminal,
          "dptTimeLocal": this.flightResponse[i].legs.leg[j].dptTime,
          "arvCity": this.flightResponse[i].legs.leg[j].arv.cityCode,
          "arvCntry": this.flightResponse[i].legs.leg[j].arv.country,
          "bookingNote": this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].bookingNote,
          "arvDD": this.flightResponse[i].legs.leg[j].legArriveDate.dd,
          "arvMM": this.flightResponse[i].legs.leg[j].legArriveDate.mm,
          "arvYYYY": this.flightResponse[i].legs.leg[j].legArriveDate.yyyy,
          "carCode": this.flightResponse[i].legs.leg[j].carCode,
          "arvRegion": "",
          "arvStation": this.flightResponse[i].legs.leg[j].arv.aptCode,
          "arvTerm":this.flightResponse[i].legs.leg[j].arv.terminal,
          "arvTimeLocal":this.flightResponse[i].legs.leg[j].arvTime,
          "changeOfEquip": this.flightResponse[i].legs.leg[j].changeOfEquip,
          "equipCode": this.flightResponse[i].legs.leg[j].dpt.terminal,
          "codeShare": this.flightResponse[i].legs.leg[j].codeShare,
          "dayIndicator":this.flightResponse[i].legs.leg[j].legDayIndicator,
          "flightMinutes": this.flightResponse[i].legs.leg[j].flightMinutes,
          "flightNumber": this.flightResponse[i].legs.leg[j].flightNumber,
          "layoverMinutes": this.flightResponse[i].legs.leg[j].layoverMinutes,
          "legMiles": this.flightResponse[i].legs.leg[j].legMiles,
          "number":this.flightResponse[i].legs.leg[j].number,
          "operatedBy": "",
          "restrictionCode":this.flightResponse[i].legs.leg[j].restrictionCode,
          "stopCodes": this.flightResponse[i].legs.leg[j].stopCodes,
          "stops": this.flightResponse[i].legs.leg[j].stops,
          "wetLease": this.flightResponse[i].legs.leg[j].wetLease,
          "userClassType":this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].userClassType,
          "amadeusClassCode": this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].amadeusClassCode,
          "class": {
            "amadeusClassCode":this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].amadeusClassCode,
            "availableSeats":this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].availableSeats,
            "bookingNote":  this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].bookingNote,
            "surcharge":this.surcharge_details,
            
            "udCabinClass":  this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].udCabinClass,
            "udIndicator": this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].udIndicator,
            "userClassType": this.flightResponse[i].legs.leg[j].classAndAvailability.class[0].userClassType,
          },
          "dptCityName":this.dpt_city(this.flightResponse[i].legs.leg[j].dpt.cityCode),
          "arvCityName":this.arv_city(this.flightResponse[i].legs.leg[j].arv.cityCode),
          "isPremiumEconomy": false
        }
        this.legArray = [...this.legArray, leg];
        if(j==this.flightResponse[i].legs.leg.length-1){
        this.ArvjournerySegmentDetails={
          "arvCity":this.flightResponse[i].legs.leg[j].arv.cityCode,
          "arvMetro":"",
          "arvCntry":this.flightResponse[i].legs.leg[j].arv.country,
          "arvDate":  this.flightResponse[i].legs.leg[j].legArriveDate.mm + "/" +this.flightResponse[i].legs.leg[j].legArriveDate.dd + "/" + this.flightResponse[i].legs.leg[j].legArriveDate.yyyy,
          "typeSeg":"FLIGHT",
          "dayIndicator":+this.flightResponse[i].dayIndicator,
        }
      }
      if(j==0){
        this.DptjournerySegmentDetails={
          "sequenceNumber":i+1,
          "dptCity": this.flightResponse[i].legs.leg[j].dpt.cityCode,
          "dptMetro":"",
          "dptCntry":this.flightResponse[i].legs.leg[j].dpt.country,
          "dptDate":  this.flightResponse[i].legs.leg[j].legDepartureDate.mm + "/" + this.flightResponse[i].legs.leg[j].legDepartureDate.dd + "/" + this.flightResponse[i].legs.leg[j].legDepartureDate.yyyy,
        }
      }
      this.seg_legs={
        "segLegs": {
          "flightIsAvailable": "true",
          "numLegs": this.flightResponse[i].legs.leg.length,
          "leg": this.legArray
        }
      }
      
      const segment = Object.assign(this.DptjournerySegmentDetails, this.ArvjournerySegmentDetails,this.seg_legs);
       
        this.legDetails = segment;
      }
      this.finalObj = [...this.finalObj, this.legDetails];
    }
    //Collect passengers details
    for(let i=0; i<this.passenger_details.total_no_of_passenger; i++){ 
      if(this. passengersList[i].airline){
        this.frequent_flyer_details={
          "airline": this. passengersList[i].airline, 
          "frequentFlyerNumber": this. passengersList[i].frequentFlyerNumber, 
        }
      }
      else{
        this.frequent_flyer_details={
        "airline":"", 
        }
      }
      this.travelers_list={
        "firstName":this. passengersList[i].firstName,
        "lastName": this. passengersList[i].lastName,
        "title": this. passengersList[i].title,
        "frequentFlyerInfo": this.frequent_flyer_details,
        "passengerType": this. passengersList[i].passengerType,
        "sequenceNumber": i+1,
        "gender":this. passengersList[i].gender,
        "middleName": "",
        "DOB":`0${this.passengersList[i].DOB.day}`.slice(-2) + this.month_list[this.passengersList[i].DOB.month-1] + this.passengersList[i].DOB.year.toString().substr(-2),
        "knownNumber": "",
        "redressNumber": ""
      }
      this.travelers_array.push(this.travelers_list);
    }
  }
  TC(){
    console.log("checked-",this.paymentInfoForm)
  }
  //get arriva citty name
  arv_city(arvCityCode){
    for(let i=0 ;i<this.station_and_city_list.cities.length;i++){
      if(this.station_and_city_list.cities[i].cityCode===arvCityCode){
        return this.station_and_city_list.cities[i].name;
      }
    }
  }
//get dpt city  name
  dpt_city(dptCityCode){
    for(let i=0 ;i<this.station_and_city_list.cities.length;i++){
      if(this.station_and_city_list.cities[i].cityCode===dptCityCode){
        return this.station_and_city_list.cities[i].name;
      }
    }
  }
  updateCardDetailsValidator(){
    this.paymentInfoForm.get('cardType').setValidators(Validators.required);
    this.paymentInfoForm.get('cardType').updateValueAndValidity();
    this.paymentInfoForm.get('cardNumber').setValidators([Validators.required,Validators.pattern("[0-9]*")]);
    this.paymentInfoForm.get('cardNumber').updateValueAndValidity();
    this.paymentInfoForm.get('expirationMonth').setValidators(Validators.required);
    this.paymentInfoForm.get('expirationMonth').updateValueAndValidity();
    this.paymentInfoForm.get('expirationYear').setValidators(Validators.required);
    this.paymentInfoForm.get('expirationYear').updateValueAndValidity();
    this.paymentInfoForm.get('cvvNumber').setValidators([Validators.required,Validators.minLength(this.cvvNumberLength),Validators.maxLength(this.cvvNumberLength),Validators.pattern("[0-9]*")]);
    this.paymentInfoForm.get('cvvNumber').updateValueAndValidity();
    this.paymentInfoForm.get('cardholderName').setValidators([Validators.required,Validators.minLength(2),Validators.maxLength(30)]);
    this.paymentInfoForm.get('cardholderName').updateValueAndValidity();
    this.paymentInfoForm.get('pincode').setValidators([Validators.required,Validators.minLength(3),Validators.maxLength(10),Validators.pattern("[a-zA-Z0-9]*")]);
    this.paymentInfoForm.get('pincode').updateValueAndValidity();
    this.paymentInfoForm.get('city').setValidators([Validators.required,Validators.minLength(3),Validators.maxLength(30),Validators.pattern("[a-zA-Z]*")]);
    this.paymentInfoForm.get('city').updateValueAndValidity();
    this.paymentInfoForm.get('state').setValidators([Validators.required,Validators.minLength(3),Validators.maxLength(30),Validators.pattern("[a-zA-Z]*")]);
    this.paymentInfoForm.get('state').updateValueAndValidity();
    this.paymentInfoForm.get('country').setValidators(Validators.required);
    this.paymentInfoForm.get('country').updateValueAndValidity();
    this.paymentInfoForm.get('address1').setValidators([Validators.required,Validators.minLength(10),Validators.maxLength(50)]);
    this.paymentInfoForm.get('address1').updateValueAndValidity();
    this.paymentInfoForm.get('address2').setValidators([Validators.minLength(10),Validators.maxLength(50)]);
    this.paymentInfoForm.get('address2').updateValueAndValidity();
    this.showPaymentFields=true;
  }
 // Getter method to access formcontrols
  get paymentDetails() {
    return this.paymentInfoForm.controls;
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
  //A method to submit payment details
  submit_payment_details(){
    this.showMask = true;
    console.log("form field",this.paymentInfoForm);
    console.log("check errors status-", this.paymentDetails.tc1.errors)
    this.submitted = true;
    if(this.paymentInfoForm.invalid){
      this.showMask = false;
      return;
    }else{
    /* Call API based on few dummy data start */
    const bookingInput= {
      "BookItinerary_Input": {
        "itinerary": {
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
                "numJSegs": this.flightResponse.length,
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
              "numChildren": this.passenger_details.numChildren,
              "numAdults": this.passenger_details.numAdults,
              "userClassType": this.flightResponse[0].classAndAvailability.class[0].amadeusClassCode,
              "cityOfOrigin":  this.flightResponse[0].dpt.cityCode,
              "countryOfResidence": ""
            },
            "tripVariables": 
              this.FlightPrice.tripVariables
            ,
            "taxLadders":
              this.FlightPrice.taxLadders,
            "itineraryOrigin": "",
            "sessionKey": this.clientSessionKey,
          }
        },
        "totalBasePrice": this.change_currency_format(this.FlightPrice.basePrice),
        "totalTax": this.change_currency_format(this.FlightPrice.tax),
        "totalAmount":this.change_currency_format(this.FlightPrice.total),
        "currency": this.FlightPrice.currencyType,
        "numAdults":  this.passenger_details.numAdults,
        "numChildren":  this.passenger_details.numChildren,
        "travellers": 
          this.travelers_array,
        "contactInformation": 
          this.contactDetails(),
        "paymentDetails": 
          this.paymentCardDetails(),
        "isFOPRequired": this.isFOPRequired
      }
    };
      /* Call API to generate pnr */
      this.flightService.getBookItinerary(bookingInput).subscribe(data => {
        sessionStorage.removeItem("pnr_details");
        if(data["errorReturn"]==null){
          /* sessionStorage.removeItem("pnr_details"); */
        sessionStorage.setItem("pnr_details", JSON.stringify(data));
        this.showMask = false;
        this.router.navigate(['/bookings/pnrDetails']);
        }else if(data["errorReturn"]==true){
          if(data["waitListSegments"]){
          alert("segments in waiting list,pnr will not be generated");
          this.showMask = false;
        }else{
          alert("due to some reason pnr is not generated");
          this.showMask = false;
        }
      }
      },
      error => {
        this.showMask = false;
        alert('general error');
      });
    }
  }
  paymentCardDetails(){
    console.log("payment form-",this.paymentInfoForm)
    if(this.flightResponse[0].legs.leg[0].carCode==='CX' || this.flightResponse[0].legs.leg[0].carCode==='AY' || this.flightResponse[0].legs.leg[0].carCode==='IB' || this.flightResponse[0].legs.leg[0].carCode==='QF'){
      this.payment_Details={
        "cardNumber":this.paymentInfoForm.value.cardNumber,
        "cvvNumber":this.paymentInfoForm.value.cvvNumber,
        "expirationMonth":this.getMonthFromString(this.paymentInfoForm.value.expirationMonth),
        "expirationYear": this.paymentInfoForm.value.expirationYear.toString().substr(-2),
        "cardholderName":this.paymentInfoForm.value.cardholderName,
        "cardType": this.paymentInfoForm.value.cardType,
        "carrierCode": this.flightResponse[0].legs.leg[0].carCode
      }
    }else{
      this.payment_Details={
        "carrierCode": this.flightResponse[0].legs.leg[0].carCode
      }
    }
    console.log("card payment details--",this.payment_Details);
    return this.payment_Details;
  }
  //getMonthFromString
  getMonthFromString(month){
  
    const keys= Object.keys(this.month_list_number);
    for(var i=0;i<Object.keys(this.month_list_number).length;i++){
      if(Object.keys(this.month_list_number)[i]===month){
      return this.month_list_number[Object.keys(this.month_list_number)[i]];
      }
    }
  }

  contactDetails(){
    if(this.flightResponse[0].legs.leg[0].carCode==='CX' || this.flightResponse[0].legs.leg[0].carCode==='AY' || this.flightResponse[0].legs.leg[0].carCode==='IB' || this.flightResponse[0].legs.leg[0].carCode==='QF'){
      this.contact_Information={
        "email": this.contactInfo.email,
        "phone": this.contactInfo.phone,
        "mobilephone": this.contactInfo.mobilephone,
        "dayphone": this.contactInfo.dayphone,
        "eveningphone":this.contactInfo.eveningphone,
        "address1": this.paymentInfoForm.value.address1,
        "city": this.paymentInfoForm.value.city,
        "country": this.getCountry(this.paymentInfoForm.value.country),
        "countryCode": this.paymentInfoForm.value.country
      }
    }else{
      this.contact_Information={
        "email": this.contactInfo.email,
        "phone": this.contactInfo.phone,
        "mobilephone": this.contactInfo.mobilephone,
        "dayphone": this.contactInfo.dayphone,
        "eveningphone":this.contactInfo.eveningphone,
      }
    }
  return this.contact_Information;
}
//Method to get country name based on country code
  getCountry(countryCode){
    for(let i=0; i < this.countries_details.length; i++){
      if(this.countries_details[i].cntryCode === countryCode){
        return this.countries_details[i].cntryName;
      } 
    }
  }
//Method to change currency format
  change_currency_format(value){
    this.price=value;
    this.price=this.price.toString();
    var afterPoint = '';
    if(this.price.indexOf('.') > 0)
    afterPoint = this.price.substring(this.price.indexOf('.'),this.price.length);
    this.price = Math.floor(this.price);
    this.price=this.price.toString();
    let lastThree = this.price.substring(this.price.length-3);
    let otherNumbers = this.price.substring(0,this.price.length-3);
    if(otherNumbers != '')
    lastThree = ',' + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
  }
  //details of selected card type
  selectedCardType(){
    if(this.paymentInfoForm.value.cardType==='CA')
    {
      this.maxCardNumber=16;
      this.cvvNumberLength=3;
    }else if(this.paymentInfoForm.value.cardType==='AX')
    {
      this.maxCardNumber=15;
      this.cvvNumberLength=4;
    }else if(this.paymentInfoForm.value.cardType==='VI')
    {
      this.maxCardNumber=16;
      this.cvvNumberLength=3;
    }else if(this.paymentInfoForm.value.cardType==='DC')
    {
      this.maxCardNumber=14;
      this.cvvNumberLength=3;
    }
    this.paymentInfoForm.get('cardNumber').setValidators([Validators.required,Validators.pattern("[0-9]*"),Validators.minLength(this.maxCardNumber),Validators.maxLength(this.maxCardNumber)]);
    this.paymentInfoForm.get('cardNumber').updateValueAndValidity();
    this.paymentInfoForm.get('cvvNumber').setValidators([Validators.required,Validators.minLength(this.cvvNumberLength),Validators.maxLength(this.cvvNumberLength),Validators.pattern("[0-9]*")]);
    this.paymentInfoForm.get('cvvNumber').updateValueAndValidity();
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

