import { Component, Input, OnInit } from '@angular/core';
import { PayTableCondition } from '../models/pay-table-condition.model';
import { WinState } from '../models/win-state.model';

@Component({
  selector: 'app-pay-table',
  templateUrl: './pay-table.component.html',
  styleUrls: ['./pay-table.component.scss']
})
export class PayTableComponent implements OnInit {

  @Input()
  public conditions: PayTableCondition[];

  @Input()
  public winState: WinState;

  constructor() { }

  ngOnInit(): void {
  }

}
