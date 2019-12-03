import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeCategoryComponent } from './theme-category.component';

describe('ThemeCategoryComponent', () => {
  let component: ThemeCategoryComponent;
  let fixture: ComponentFixture<ThemeCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
