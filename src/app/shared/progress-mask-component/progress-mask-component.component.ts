import { Component, OnInit, Input  } from '@angular/core';

@Component({
  selector: 'app-progress-mask-component',
  templateUrl: './progress-mask-component.component.html',
  styleUrls: ['./progress-mask-component.component.css']
})
export class ProgressMaskComponentComponent implements OnInit {
  @Input() showProgress:boolean = false;
  @Input() showProgress_mini:boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
