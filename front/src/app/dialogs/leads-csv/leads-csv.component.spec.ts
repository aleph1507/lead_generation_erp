import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsCsvComponent } from './leads-csv.component';

describe('LeadsCsvComponent', () => {
  let component: LeadsCsvComponent;
  let fixture: ComponentFixture<LeadsCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
