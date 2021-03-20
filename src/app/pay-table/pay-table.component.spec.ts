import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlotMachineComponent } from '../slot-machine/slot-machine.component';

import { PayTableComponent } from './pay-table.component';

describe('PayTableComponent', () => {
  let component: PayTableComponent;
  let fixture: ComponentFixture<PayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayTableComponent, SlotMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
