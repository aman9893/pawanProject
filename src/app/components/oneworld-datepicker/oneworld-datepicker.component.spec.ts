import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneworldDatepickerComponent } from './oneworld-datepicker.component';

describe('OneworldDatepickerComponent', () => {
  let component: OneworldDatepickerComponent;
  let fixture: ComponentFixture<OneworldDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneworldDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneworldDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
