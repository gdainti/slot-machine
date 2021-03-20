import { Injectable } from '@angular/core';
import { config } from '../config/configuration';
import { PayTableConditionName } from '../models/pay-table-condition-name.enum';
import { ReelElementName } from '../models/reel-element-name.enum';
import { ReelLine } from '../models/reel-line.enum';
import { Reel } from '../models/reel.model';

@Injectable({ providedIn: 'root' })
export class SlotMachineService {

  constructor() {}

  public getRandomElement(): ReelElementName {
    const list = Object.values(ReelElementName);
    return list[this.getRandomIndex(list.length)];
  }

  public getRandomLine(): ReelLine {
    const list = Object.values(ReelLine);
    return list[this.getRandomIndex(list.length)];
  }

  private getRandomIndex(length: number) {
    return Math.floor(Math.random() * length);
  }

  public async delay(ms: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), ms);
    });
  }

  public getBalance(value: number): number {
    if (!value) {
      return config.minBalance;
    }
    const intValue = parseInt(value.toString(), 10);
    return intValue && intValue < config.minBalance
    ? config.minBalance : intValue > config.maxBalance
      ? config.maxBalance
      : intValue;
  }

  public getReels(): Reel[] {

    const reels = [];

    for (let i = 0; i < config.reelsAmount; i++) {

      const line = this.getRandomLine();
      const target = this.getRandomElement();

      reels.push({
        id: i,
        line: line,
        target: target,
        elements: this.getVisibleElements(line, target, true),
        topOffset: this.getLineOffset(line),
        isSpinning: false,
        isStopping: false,
      });
    }

    return reels;
  }

  public getReelElementByIndex(elementName: ReelElementName, position: number = 0) {
    const index = config.reelElements.findIndex(it => it.name === elementName);
    if (index === -1) {
      return null;
    }
    const elementIndex = index + position;
    if (elementIndex < 0) {
      return config.reelElements[config.reelElements.length - 1];
    }

    if (elementIndex > config.reelElements.length - 1) {
      return config.reelElements[0];
    }

    return config.reelElements[elementIndex];
  }

  public getPayTableCondition(name: string, line: ReelLine) {
    if (!name) {
      return null;
    }
    return {
      condition: config.winStates.find(it => it.name === name),
      line: line,
    };
  }

  private getWinByLine(list: string[], line: ReelLine) {

    if (list.every(it => it === list[0]) && list[0] === ReelElementName.CHERRY) {
      switch(line) {
        case ReelLine.BOTTOM:
          return this.getPayTableCondition(PayTableConditionName.CHERRY_BOTTOM, line);
        case ReelLine.CENTER:
          return this.getPayTableCondition(PayTableConditionName.CHERRY_CENTER, line);
        case ReelLine.TOP:
          return this.getPayTableCondition(PayTableConditionName.CHERRY_TOP, line);
        default:
          break;
      }
    }

    if (list.every(it => it === list[0]) && list[0] === ReelElementName.SEVEN) {
      return this.getPayTableCondition(PayTableConditionName.SEVEN_ANY, line);
    }

    if (list.every(it => it === ReelElementName.CHERRY || it === ReelElementName.SEVEN)) {
      return this.getPayTableCondition(PayTableConditionName.CHERRY_OR_SEVEN_ANY, line);
    }

    if (list.every(it => it === list[0]) && list[0] === ReelElementName.BAR3) {
      return this.getPayTableCondition(PayTableConditionName.BAR3_ANY, line);
    }

    if (list.every(it => it === list[0]) && list[0] === ReelElementName.BAR2) {
      return this.getPayTableCondition(PayTableConditionName.BAR2_ANY, line);
    }

    if (list.every(it => it === list[0]) && list[0] === ReelElementName.BAR) {
      return this.getPayTableCondition(PayTableConditionName.BAR_ANY, line);
    }

    if (list.every(it => it === ReelElementName.BAR || it === ReelElementName.BAR2 || it === ReelElementName.BAR3)) {
      return this.getPayTableCondition(PayTableConditionName.BARS_ANY, line);
    }

    return null;
  }

  public getLineOffset(line: ReelLine) {
    return line === ReelLine.CENTER
      ? Math.round(config.element.height / 2)
      : 0;
  }

  public checkConditions(reels: Reel[]) {

    const result = {
      top: [],
      center: [],
      bottom: [],
    }

    for (let i = 0; i < reels.length; i++) {

      switch(reels[i].line) {
        case ReelLine.TOP:
          result.top.push(reels[i].target);
          const bottomElement = this.getReelElementByIndex(reels[i].target, 1);
          if (bottomElement) {
            result.bottom.push(bottomElement.name);
          }
          break;
        case ReelLine.CENTER:
          result.center.push(reels[i].target);
          break;
        case ReelLine.BOTTOM:
          result.bottom.push(reels[i].target);
          const topElement = this.getReelElementByIndex(reels[i].target, -1);
          if (topElement) {
            result.top.push(topElement.name);
          }
          break;

        default:
          break;
      }
    }

    if (result.center.length === reels.length) {
      return this.getWinByLine(result.center, ReelLine.CENTER);
    }

    if (result.top.length === result.bottom.length && result.top.length === reels.length) {
      const bottomWin = this.getWinByLine(result.bottom, ReelLine.BOTTOM);
      const topWin = this.getWinByLine(result.top, ReelLine.TOP);

      if (bottomWin && topWin) {
        return bottomWin.condition.win > topWin.condition.win ? bottomWin : topWin;
      }

      return (bottomWin) ? bottomWin : (topWin) ? topWin : null;
    }

    return null;
  }

  public getVisibleElements(line: ReelLine, target: ReelElementName, isInit: boolean = false) {
    if (line === ReelLine.TOP) {
      return [
        ...!isInit ? [this.getReelElementByIndex(target, -1)] : [],
        this.getReelElementByIndex(target, 0),
        this.getReelElementByIndex(target, 1),
      ];
    }

    if (line === ReelLine.BOTTOM) {
      return [
        ...!isInit ? [this.getReelElementByIndex(target, -2)] : [],
        this.getReelElementByIndex(target, -1),
        this.getReelElementByIndex(target, 0),
      ];
    }

    return [
      ...!isInit ? [this.getReelElementByIndex(target, -2)] : [],
      this.getReelElementByIndex(target, -1),
      this.getReelElementByIndex(target, 0),
      this.getReelElementByIndex(target, 1),
    ]
  }
}
