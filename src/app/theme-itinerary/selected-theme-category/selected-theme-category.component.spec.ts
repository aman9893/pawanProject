import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedThemeCategoryComponent } from './selected-theme-category.component';

describe('SelectedThemeCategoryComponent', () => {
  let component: SelectedThemeCategoryComponent;
  let fixture: ComponentFixture<SelectedThemeCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedThemeCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedThemeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
