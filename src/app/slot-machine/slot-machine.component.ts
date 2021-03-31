import { Component, HostListener } from '@angular/core';
import { config } from '../config/configuration';
import { Reel } from '../models/reel.model';
import { ReelElementName } from '../models/reel-element-name.enum';
import { ReelLine } from '../models/reel-line.enum';
import { SlotMachineService } from './slot-machine.service';
import { PayTableConditionName } from '../models/pay-table-condition-name.enum';
import { WinState } from '../models/win-state.model';

@Component({
  selector: 'app-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.scss'],
})

export class SlotMachineComponent {

  public reels: Reel[] = [];
  public balance: number = config.defaultBalance;
  public isDebugMode: boolean = false;
  public isSpinningInProgress: boolean = false;
  public winState: WinState = null;
  public config = config;

  public debugElements = Object.values(ReelElementName);
  public debugLines = Object.values(ReelLine);
  public payTableConditionNames = Object.values(PayTableConditionName);

  constructor(
    private slotMachineService: SlotMachineService,
  ) {
  }

  public ngOnInit() {
    this.reels = this.slotMachineService.getReels();
  }

  @HostListener('document:keydown.enter', ['$event'])
  @HostListener('document:keydown.Space', ['$event'])
  public onKeydownHandler(event: KeyboardEvent) {
    if (!this.isSpinDisabled()) {
      this.spin();
    }
  }

  public onBalanceChange(event: any) {
    this.balance = this.slotMachineService.getBalance(event.target.value);
  }

  public onDebugModeChange(event: any) {
    this.isDebugMode = event.target.value;
  }

  public onElementChange(event: any, id: number) {
    this.reels.forEach(it => {
      if (it.id === id) {
        it.target = event.target.value;
      }
    });
  }

  public onLineChange(event: any, id: number) {
    this.reels.forEach(it => {
      if (it.id === id) {
        it.line = event.target.value;
      }
    });
  }

  public isSpinDisabled() {
    return this.balance <= 0 || this.isSpinning();
  }

  public isSpinning() {
    return this.reels.some(it => it.isSpinning === true) || this.isSpinningInProgress;
  }

  public async spin() {
    this.balance = Math.max(this.balance - config.spinCost, 0);
    this.winState = null;
    this.isSpinningInProgress = true;

    this.reels.forEach(it => {
      it.isSpinning = true;
      it.isStopping = false;
      it.elements = config.reelElements;
      it.topOffset = 0;
    });

    await this.slotMachineService.delay(config.spinningTimeMs);

    for await (const [index, it] of this.reels.entries()) {
      it.isSpinning = true;

      if (!this.isDebugMode) {
        it.target = this.slotMachineService.getRandomElement();
        it.line = this.slotMachineService.getRandomLine();
      }

      it.topOffset = this.slotMachineService.getLineOffset(it.line);
      it.isStopping = true;

      await this.slotMachineService.delay(config.delayBetweenReelsMs);

      it.elements = this.slotMachineService.getVisibleElements(it.line, it.target);
      it.isSpinning = false;
    }

    await this.slotMachineService.delay(500);
    this.isSpinningInProgress = false;

    this.winState = this.slotMachineService.checkConditions(this.reels);

    if (this.winState) {
      this.balance += this.winState.condition.win;
    }
  }
}
