import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLeadComponent } from './single-lead.component';

describe('SingleLeadComponent', () => {
  let component: SingleLeadComponent;
  let fixture: ComponentFixture<SingleLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
