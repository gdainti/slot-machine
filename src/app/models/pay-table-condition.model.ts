import { PayTableConditionName } from './pay-table-condition-name.enum';

export interface PayTableCondition {
  name: PayTableConditionName;
  win: number;
}