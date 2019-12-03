import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'select-airport',
  templateUrl: './select-airport.component.html',
  styleUrls: ['./select-airport.component.less']
})
export class SelectAirportComponent implements OnInit {
  @ViewChild("selectAirportModal", {read: TemplateRef, static: true}) selectAirportModal: TemplateRef<any>;
  modalReference: any;
  showSelectAirport: boolean;
  searchAirport: string;
  
  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {
    this.searchAirport = '';
    if (window.innerWidth < 720) {
      this.showSelectAirport = false;
      this.openModal();
    } else {
      this.showSelectAirport = true;
    }
  }

  ngOnInit() {
  }

  openModal() {
    if (this.modalReference) {
      return;
    }
    this.modalReference = this.modalService.open(this.selectAirportModal, {size: "lg", backdrop: "static", scrollable : true});
    this.modalReference.result.then((result) => {
      console.log(result);
    });
  }
}
