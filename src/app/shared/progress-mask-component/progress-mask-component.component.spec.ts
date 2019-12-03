import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressMaskComponentComponent } from './progress-mask-component.component';

describe('ProgressMaskComponentComponent', () => {
  let component: ProgressMaskComponentComponent;
  let fixture: ComponentFixture<ProgressMaskComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressMaskComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressMaskComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
