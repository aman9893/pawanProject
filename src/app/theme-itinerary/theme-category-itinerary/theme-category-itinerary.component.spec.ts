import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeCategoryItineraryComponent } from './theme-category-itinerary.component';

describe('ThemeCategoryItineraryComponent', () => {
  let component: ThemeCategoryItineraryComponent;
  let fixture: ComponentFixture<ThemeCategoryItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeCategoryItineraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeCategoryItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
