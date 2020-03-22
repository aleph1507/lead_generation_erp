import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLeadsComponent } from './client-leads.component';

describe('ClientLeadsComponent', () => {
  let component: ClientLeadsComponent;
  let fixture: ComponentFixture<ClientLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
