import { PayTableCondition } from './pay-table-condition.model';
import { ReelLine } from './reel-line.enum';

export interface WinState {
  condition: PayTableCondition;
  line: ReelLine;
}