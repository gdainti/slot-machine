import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { ReelElementName } from '../models/reel-element-name.enum';
import { PayTableComponent } from '../pay-table/pay-table.component';
import { SlotMachineComponent } from './slot-machine.component';
import { SlotMachineService } from './slot-machine.service';
import { config } from '../config/configuration';
import { ReelLine } from '../models/reel-line.enum';
import { PayTableConditionName } from '../models/pay-table-condition-name.enum';
import { Reel } from '../models/reel.model';

const reelFabric = (target: ReelElementName, line: ReelLine = ReelLine.TOP) => {
  return [
    { target, line },
    { target, line },
    { target, line },
  ] as any as Reel[];
}

describe('SlotMachineService', () => {
  let service: SlotMachineService;

  TestBed.configureTestingModule({
    declarations: [ SlotMachineComponent, PayTableComponent ],
    imports: [
      AppModule,
    ],
    providers: [ SlotMachineService ]
  });

  beforeEach(async () => {
    service = TestBed.inject(SlotMachineService);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  describe('getReelElementByIndex()', () => {
    it('should return correct Element By Position', () => {
      const result0 = service.getReelElementByIndex(config.reelElements[1].name, 0);
      const result1 = service.getReelElementByIndex(config.reelElements[0].name, 0);
      const result2 = service.getReelElementByIndex(config.reelElements[config.reelElements.length - 1].name, 0);

      const result3 = service.getReelElementByIndex(config.reelElements[1].name, 1);
      const result4 = service.getReelElementByIndex(config.reelElements[0].name, 1);
      const result5 = service.getReelElementByIndex(config.reelElements[config.reelElements.length - 1].name, 1);

      const result6 = service.getReelElementByIndex(config.reelElements[1].name, -1);
      const result7 = service.getReelElementByIndex(config.reelElements[0].name, -1);
      const result8 = service.getReelElementByIndex(config.reelElements[config.reelElements.length - 1].name, -1);

      expect(result0).toEqual(config.reelElements[1]);
      expect(result1).toEqual(config.reelElements[0]);
      expect(result2).toEqual(config.reelElements[config.reelElements.length - 1]);

      expect(result3).toEqual(config.reelElements[2]);
      expect(result4).toEqual(config.reelElements[1]);
      expect(result5).toEqual(config.reelElements[0]);

      expect(result6).toEqual(config.reelElements[0]);
      expect(result7).toEqual(config.reelElements[config.reelElements.length - 1]);
      expect(result8).toEqual(config.reelElements[config.reelElements.length - 2]);
    });
  });

  describe('getBalance()', () => {
    it('should return correct balance number', () => {
      expect(service.getBalance(-100)).toEqual(0);
      expect(service.getBalance(NaN)).toEqual(0);
      expect(service.getBalance(0)).toEqual(0);
      expect(service.getBalance(100)).toEqual(100);
      expect(service.getBalance(6000)).toEqual(5000);
    });
  });

  describe('getLineOffset()', () => {
    it('should return correct offset for CENTER line', () => {
      expect(service.getLineOffset(ReelLine.TOP)).toEqual(0);
      expect(service.getLineOffset(ReelLine.CENTER)).toEqual(config.element.height / 2);
      expect(service.getLineOffset(ReelLine.BOTTOM)).toEqual(0);
    });
  });

  describe('checkConditions()', () => {

    it('should return correct win object for Cherries', () => {

      const REELS_TOP = reelFabric(ReelElementName.CHERRY, ReelLine.TOP);
      const REELS_CENTER = reelFabric(ReelElementName.CHERRY, ReelLine.CENTER);
      const REELS_BOTTOM = reelFabric(ReelElementName.CHERRY, ReelLine.BOTTOM);

      const topResult = service.checkConditions(REELS_TOP);
      const centerResult = service.checkConditions(REELS_CENTER);
      const bottomResult = service.checkConditions(REELS_BOTTOM);

      expect(topResult.condition.name).toEqual(PayTableConditionName.CHERRY_TOP);
      expect(topResult.condition.win).toEqual(2000);
      expect(centerResult.condition.name).toEqual(PayTableConditionName.CHERRY_CENTER);
      expect(centerResult.condition.win).toEqual(1000);
      expect(bottomResult.condition.name).toEqual(PayTableConditionName.CHERRY_BOTTOM);
      expect(bottomResult.condition.win).toEqual(4000);
    });

    it('should return correct win object for Sevens', () => {

      const REELS = reelFabric(ReelElementName.SEVEN, ReelLine.CENTER);
      const REELS_CHERRY = reelFabric(ReelElementName.SEVEN, ReelLine.TOP);

      const result1 = service.checkConditions(REELS);
      const result2 = service.checkConditions(REELS_CHERRY);

      expect(result1.condition.name).toEqual(PayTableConditionName.SEVEN_ANY);
      expect(result1.condition.win).toEqual(150);

      expect(result2.condition.name).toEqual(PayTableConditionName.CHERRY_BOTTOM);
      expect(result2.condition.win).toEqual(4000);
    });

    it('should return correct win object for Cherries or Sevens', () => {

      const REELS1 = [
        {
          target: ReelElementName.SEVEN,
          line:  ReelLine.TOP,
        },
        {
          target: ReelElementName.SEVEN,
          line:  ReelLine.TOP,
        },
        {
          target: ReelElementName.CHERRY,
          line:  ReelLine.TOP,
        }
      ] as any as Reel[];

      const REELS2 = [
        {
          target: ReelElementName.CHERRY,
          line:  ReelLine.BOTTOM,
        },
        {
          target: ReelElementName.SEVEN,
          line:  ReelLine.BOTTOM,
        },
        {
          target: ReelElementName.CHERRY,
          line:  ReelLine.BOTTOM,
        }
      ] as any as Reel[];

      const result1 = service.checkConditions(REELS1);
      const result2 = service.checkConditions(REELS2);

      expect(result1.condition.name).toEqual(PayTableConditionName.CHERRY_OR_SEVEN_ANY);
      expect(result1.condition.win).toEqual(75);

      expect(result2.condition.name).toEqual(PayTableConditionName.CHERRY_OR_SEVEN_ANY);
      expect(result2.condition.win).toEqual(75);

    });

    it('should return correct win object for BARS', () => {
      const REELS1 = reelFabric(ReelElementName.BAR3, ReelLine.TOP);
      const REELS2 = reelFabric(ReelElementName.BAR2, ReelLine.CENTER);
      const REELS3 = reelFabric(ReelElementName.BAR, ReelLine.CENTER);
      const REELS4= reelFabric(ReelElementName.BAR, ReelLine.BOTTOM);

      const result1 = service.checkConditions(REELS1);
      const result2 = service.checkConditions(REELS2);
      const result3 = service.checkConditions(REELS3);
      const result4 = service.checkConditions(REELS4);

      expect(result1.condition.name).toEqual(PayTableConditionName.BAR3_ANY);
      expect(result1.condition.win).toEqual(50);

      expect(result2.condition.name).toEqual(PayTableConditionName.BAR2_ANY);
      expect(result2.condition.win).toEqual(20);

      expect(result3.condition.name).toEqual(PayTableConditionName.BAR_ANY);
      expect(result3.condition.win).toEqual(10);

      expect(result4.condition.name).toEqual(PayTableConditionName.BAR3_ANY);
      expect(result4.condition.win).toEqual(50);
    });

    it('should return correct win object for any BAR symbols', () => {

      const REELS1 = [
        {
          target: ReelElementName.BAR3,
          line:  ReelLine.TOP,
        },
        {
          target: ReelElementName.BAR2,
          line:  ReelLine.TOP,
        },
        {
          target: ReelElementName.BAR3,
          line:  ReelLine.TOP,
        }
      ] as any as Reel[];

      const REELS2 = [
        {
          target: ReelElementName.BAR,
          line:  ReelLine.CENTER,
        },
        {
          target: ReelElementName.BAR3,
          line:  ReelLine.CENTER,
        },
        {
          target: ReelElementName.BAR2,
          line:  ReelLine.CENTER,
        }
      ] as any as Reel[];

      const REELS3 = [
        {
          target: ReelElementName.BAR2,
          line:  ReelLine.BOTTOM,
        },
        {
          target: ReelElementName.BAR2,
          line:  ReelLine.BOTTOM,
        },
        {
          target: ReelElementName.BAR3,
          line:  ReelLine.BOTTOM,
        }
      ] as any as Reel[];


      const result1 = service.checkConditions(REELS1);
      const result2 = service.checkConditions(REELS2);
      const result3 = service.checkConditions(REELS3);

      expect(result1.condition.name).toEqual(PayTableConditionName.BARS_ANY);
      expect(result1.condition.win).toEqual(5);

      expect(result2.condition.name).toEqual(PayTableConditionName.BARS_ANY);
      expect(result2.condition.win).toEqual(5);

      expect(result3.condition.name).toEqual(PayTableConditionName.BARS_ANY);
      expect(result3.condition.win).toEqual(5);
    });

  });

});
