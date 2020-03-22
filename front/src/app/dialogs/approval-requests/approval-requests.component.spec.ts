import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalRequestsComponent } from './approval-requests.component';

describe('ApprovalRequestsComponent', () => {
  let component: ApprovalRequestsComponent;
  let fixture: ComponentFixture<ApprovalRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
