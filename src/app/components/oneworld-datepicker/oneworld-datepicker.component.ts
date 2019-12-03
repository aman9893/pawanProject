import { Component, OnInit, ViewChild, Input, TemplateRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from './../../Service/store.service';
import { NgxSpinnerService } from "ngx-spinner";
// This lets me use jquery
declare var $: any;

const today = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

@Component({
  selector: 'oneworld-datepicker',
  templateUrl: './oneworld-datepicker.component.html',
  styleUrls: ['./oneworld-datepicker.component.less']
})
export class OneworldDatepickerComponent implements OnInit, OnChanges {

  @ViewChild("datepickerModal1", {read: TemplateRef, static: true}) datepickerModal1: TemplateRef<any>;

  // @Input() flightId: any;
  @Input() loading: boolean;
  @Input() departureDate: string;
  @Output() onClickDate: EventEmitter<any> = new EventEmitter<any>();
  
  showDatepicker: boolean;
  showMobileDatepicker: boolean;
  calendarData: any = [];
  currYear: number;
  currMonth: number;
  nextYear: number;
  nextMonth: number;
  currentEnableDays: any = [];
  nextEnableDays: any = [];
  startMM: number;
  startYYYY: number;
  endMM: number;
  endYYYY: number;
  enableDays: any  = {};
  disablePrev: boolean;
  disableNext: boolean;
  private modalReference: any;
  selYear: number = 0;
  selMonth: number = 0;
  selDay: number = 0;

  constructor(
    private storeService: StoreService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { 
  }
  
  ngOnInit() {
    this.showDatepicker = false;
    this.showMobileDatepicker = false;
    this.currYear = today.getFullYear();
    this.currMonth = (today.getMonth() + 1 );
    this.disablePrev = false;
    this.disableNext = false;
    this.calendarData = this.storeService.getCalendarData();
    if (this.calendarData && this.calendarData.length > 0) {
      this.currYear = +this.calendarData[0]['yyyy'];
      this.currMonth = +this.calendarData[0]['mm'];
      this.startMM = +this.calendarData[0]['mm'];
      this.startYYYY = +this.calendarData[0]['yyyy'];
      let len = this.calendarData.length;
      this.endMM = +this.calendarData[len - 1]['mm'];
      this.endYYYY = +this.calendarData[len - 1]['yyyy'];
    } else {
      this.startMM = this.currMonth;
      this.startYYYY = this.currYear;
      this.endMM = this.currMonth;
      this.endYYYY = this.currYear;
    }

    this.getEnableDays();
    this.initDate();
    if (window.innerWidth < 720) {
      this.showDatepicker = false;
      this.openModal();
    } else {
      this.showDatepicker = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
     if (changes['loading']) {
       this.loading ? this.spinner.show(): this.spinner.hide();
       this.ngOnInit();
     }
  }

  initDate() {
    let currDate = new Date(this.currYear + ' ' + this.currMonth);
    currDate.setMonth(currDate.getMonth() + 1);
    this.nextYear = currDate.getFullYear();
    this.nextMonth = currDate.getMonth() + 1;
    this.setDisablePrevNext();
  }

  // get enable days
  getEnableDays() {
    this.enableDays = {};
    // this.nextEnableDays = [];
    this.calendarData.map((item) => {
      let mm = +item.mm;
      if (!this.enableDays[item.yyyy + '_' + mm]) {
        this.enableDays[item.yyyy + '_' + mm] = [];
      }
      if (item.flag == 'D') {
        this.enableDays[item.yyyy + '_' + mm].push(+item.dd)
      }
    })
  }

  // get blank days of month
  getBlankDays(yyyy, mm) {
    const ind = new Date(yyyy + ' ' + mm).getDay();
    return Array.from(Array(ind).keys());
  }

  // get month name
  getMonthYearTitle(yyyy, mm) {
    let dt = new Date(yyyy + ' ' + mm);
    return monthNames[dt.getMonth()] + ', ' + dt.getFullYear();
  }

  // get month days
  getMonthDays(yyyy, mm) {
    let dt = new Date(+yyyy, +mm, 0);
    return Array.from(Array(dt.getDate()).keys());
  }

  // check enable days
  checkEnableDay(yyyy, mm, dd) {
    let days = this.enableDays[yyyy + '_' + mm];
    if (days && days.indexOf(+dd) > -1) {
      if (this.selYear == yyyy && this.selMonth == mm && this.selDay == dd) {
        return 'enable-day active'; 
      }
      return 'enable-day';
    }
    return 'disable-day';
  }

  // show calendar
  // onClickSelecteDate() {
  //   if (window.innerWidth < 720) {
  //     this.openModal();
  //   } else {
  //     this.showDatepicker = !this.showDatepicker;
  //   }
    
  // }

  // goto next month
  onClickNextMonth() {
    if (!this.disableNext) {
      let d = new Date(this.currYear + ' ' + this.currMonth);
      d.setMonth(d.getMonth() + 2);
      this.currYear = d.getFullYear();
      this.currMonth = (d.getMonth() + 1 );
      this.initDate();
    }
  }

  // goto prev month
  onClickPrevMonth() {
    if (!this.disablePrev) {
      let d = new Date(this.currYear + ' ' + this.currMonth);
      d.setMonth(d.getMonth() - 2);
      this.currYear = d.getFullYear();
      this.currMonth = (d.getMonth() + 1 );
      this.initDate();
    }
  }

  // set Prev and Next icon enable / disable
  setDisablePrevNext() {
    this.disablePrev = false;
    this.disableNext = false;
    if (this.nextYear * 12 + this.nextMonth >= this.endYYYY * 12 + this.endMM){
      this.disableNext = true;
    }
    if (this.currYear * 12 + this.currMonth <= this.startYYYY * 12 + this.startMM){
      this.disablePrev = true;
    }
  }
  // get mobile months
  getTotalMonths() {
    let months = [{
      yyyy: this.startYYYY,
      mm: this.startMM
    }];
    const cnt = (this.endYYYY - this.startYYYY) * 12 - this.startMM + this.endMM + 1;
    let dt = new Date(this.startYYYY + ' ' + this.startMM);
    let i = 1;
    while (true) {
      i += 1;
      if (i > cnt) break;
      dt.setMonth(dt.getMonth() + 1);
      months.push({
        yyyy: dt.getFullYear(),
        mm:  dt.getMonth() + 1
      })     
    }
    return months;
  }

  onClickDay(yyyy, mm, dd) {
    const res = ("0" + mm).slice(-2) + '/' + ("0" + dd).slice(-2) + '/' + yyyy;
    
    if (!this.showDatepicker) {
      if (this.modalReference) {
        this.selYear = yyyy;
        this.selMonth = mm;
        this.selDay = dd;
        return;
      }
    }
    this.onClickDate.emit(res);
  }

  openModal() {
    if (this.modalReference) {
      return;
    }
    this.modalReference = this.modalService.open(this.datepickerModal1, {size: "lg", backdrop: "static", scrollable : true});
  
    this.modalReference.result.then((result) => {
      this.onClickDate.emit(result);
    });
  }

  onClickDone() {
    const res = ("0" + this.selMonth).slice(-2) + '/' + ("0" + this.selDay).slice(-2) + '/' + this.selYear;
    this.modalReference.close(res);
  }

  // onClickDa() {
  //   // this.onClickDate.emit()
  // }

}
