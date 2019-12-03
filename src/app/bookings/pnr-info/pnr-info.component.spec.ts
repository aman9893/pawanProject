import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnrInfoComponent } from './pnr-info.component';

describe('PnrInfoComponent', () => {
  let component: PnrInfoComponent;
  let fixture: ComponentFixture<PnrInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnrInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnrInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
