import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsByClientComponent } from './leads-by-client.component';

describe('LeadsByClientComponent', () => {
  let component: LeadsByClientComponent;
  let fixture: ComponentFixture<LeadsByClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsByClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsByClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
