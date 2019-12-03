import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,AbstractControl,FormControl} from "@angular/forms";
import { TravellerDetails } from '../../Interface/homeInterface';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FlightService } from '../../Service/flight.service';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';

const today = new Date();
@Component({
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrls: ['./passenger-info.component.less']
})
export class PassengerInfoComponent implements OnInit {
  passengerInfoForm:FormGroup;
  submitted: boolean = false;
  default_adult: string = 'ADT';
  default_child: string = 'CHD';
  no_of_passengers:any={};
  
  contactDetails:any= {
    mobilephone:"",
    dayphone:"",
    eveningphone:""
  };
  passengerDetails: TravellerDetails[] =[];
  passengerAndContactDetails=[];
  contactFormStatus:boolean=false;
  today = new Date();
  newtoday: any;
  adutlt_age_flag: boolean;
  maxDate: NgbDateStruct = { year: today.getFullYear() - 12, month: today.getMonth(), day: today.getMonth() };
  minDate: NgbDateStruct = { year: 1900, month: today.getMonth(), day: today.getMonth() };
  CHD_maxDate: NgbDateStruct = { year: today.getFullYear() - 2, month: today.getMonth(), day: today.getDate() };
  CHD_minDate: NgbDateStruct = { year: today.getFullYear() - 12, month: today.getMonth(), day: today.getDate()};
  passenger_type_flag: boolean;
  child_age_flag: boolean;
  passenger_type_adult: string;
  adult_age_flag: boolean;
  passenger_type_child: string;
  cnf_email_flag: boolean;
  editable: boolean = true;
  numAdults: 1;
  numChildren: any;
  month_list = [ "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
  constructor(private formBuilder: FormBuilder,private router: Router,private flightService: FlightService,) {}
  
  ngOnInit() {
  this.no_of_passengers= JSON.parse(sessionStorage.getItem('no_of_passenger'));
  this.newtoday = moment(this.today).toObject();
  this.showAllTravellerField();
}
  //validate method
  checkConfirmEmail(){
      this.cnf_email_flag=false;
    if(this.contactDetails.email!==this.contactDetails.confirmed_email){
      this.cnf_email_flag=true;
    }
  }
  showAllTravellerField() {
   if(this.no_of_passengers.numAdults){
      this.passenger_type_flag=false;
    for (let j = 1; j <= this.no_of_passengers.numAdults; j++) {
      const newObj = {
        id: this.passengerDetails.length + 1,
        passengerType: this.default_adult,
        title: '',
        firstName: '',
        lastName: '',
        gender: '',
        DOB: {},
        airline: '',
        frequentFlyerNumber: '',
      };
     this.passengerDetails = [...this.passengerDetails , newObj]
    }
  }
  if(this.no_of_passengers.numChildren){
    this.passenger_type_flag=true;
    for (let j = 1; j <= this.no_of_passengers.numChildren; j++) {
        const newObj = {
          id: this.passengerDetails.length + 1,
          passengerType: this.default_child,
          title: '',
          firstName: '',
          lastName: '',
          gender: '',
          DOB: {},
          airline: '',
          frequentFlyerNumber: '',
        };
        this.passengerDetails = [...this.passengerDetails , newObj]
      }
    }
    sessionStorage.removeItem("number_of_passengers");
    sessionStorage.setItem("number_of_passengers", JSON.stringify(this.passengerDetails.length));
  }

  getIDByIndex(index: number, name: string) {
    return `${name}${index}`;
  }
  validateAdultAge(event, index){
    const current_month=this.newtoday.years
    this.passenger_type_adult===this.passengerDetails[index].passengerType;
    console.log(index, this.passenger_type_adult=this.passengerDetails[index].passengerType)
     this.passenger_type_adult=this.passengerDetails[index].passengerType;
    if(this.passengerDetails[index].passengerType==='ADT'){
      
      if(parseInt(this.newtoday.years)-parseInt(this.passengerDetails[index].DOB.year)<=12){
       this.adult_age_flag=true;
       this.child_age_flag=false;
       console.log("adt-", this.adult_age_flag)
       console.log("adt-value", this.passenger_type_adult)
       
      }
    }
     if(this.passengerDetails[index].passengerType==='CHD'){
     /*  this.passenger_type_child==='CHD' */
      if(parseInt(this.newtoday.years)-parseInt(this.passengerDetails[index].DOB.year)>=12){
     
        this.child_age_flag=true;
        this.adult_age_flag=false;
       console.log("chd-flag", this.child_age_flag)
       console.log("chd-value", this.passenger_type_child)
      }
    }
  }
  validateChildAge(event, index){
    
    this.passenger_type_child==='CHD'
     if(this.passengerDetails[index].passengerType==='CHD'){
      if(parseInt(this.newtoday.years)-parseInt(this.passengerDetails[index].DOB.year)>=12){
        this.adult_age_flag=false;
      console.log("ca v",this.child_age_flag)
    }
  }
}
  //Method to submit payment details
  submit_payment_details(){
    sessionStorage.removeItem("contact_details");
    sessionStorage.removeItem("travelers_details");
    sessionStorage.setItem("contact_details", JSON.stringify(this.contactDetails));
    sessionStorage.setItem("travelers_details", JSON.stringify(this.passengerDetails));
    //Call  GetCarrierCards  method
    let carrier_code={"carrier_code":"BA"}
    this.flightService.getCarrierCards(carrier_code).subscribe(data => {
      sessionStorage.removeItem("carrier_code_details");
      sessionStorage.setItem("carrier_code_details", JSON.stringify(data));
    });
    this.router.navigate(['/bookings/ItineraryDetails']);
  }
}
