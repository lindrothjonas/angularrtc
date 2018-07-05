import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallcenterComponent } from './callcenter.component';

describe('CallcenterComponent', () => {
  let component: CallcenterComponent;
  let fixture: ComponentFixture<CallcenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallcenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
