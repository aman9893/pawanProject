import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAirportComponent } from './select-airport.component';

describe('SelectAirportComponent', () => {
  let component: SelectAirportComponent;
  let fixture: ComponentFixture<SelectAirportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAirportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAirportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
