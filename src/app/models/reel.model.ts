import { ReelElementName } from './reel-element-name.enum';
import { ReelElement } from './reel-element.model';
import { ReelLine } from './reel-line.enum';

export interface Reel {
  id: number;
  elements: ReelElement[];
  target: ReelElementName;
  line: ReelLine,
  isSpinning: boolean;
  isStopping: boolean;
  topOffset: number;
}
