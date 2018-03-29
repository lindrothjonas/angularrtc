import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainlistComponent } from './mainlist.component';

describe('MainlistComponent', () => {
  let component: MainlistComponent;
  let fixture: ComponentFixture<MainlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
