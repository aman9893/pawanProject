import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-select',
  templateUrl: './flight-select.component.html',
  styleUrls: ['./flight-select.component.less']
})
export class FlightSelectComponent implements OnInit {
  header_caption = 'Flight Selection';
  constructor() { }

  ngOnInit() {
  }

}
