import { PayTableConditionName } from '../models/pay-table-condition-name.enum';
import { ReelElementName } from '../models/reel-element-name.enum';

export const config = {
  element: {
    height: 160,
    width: 160,
  },
  spinCost: 1,
  reelsAmount: 3,
  defaultBalance: 10,
  delayBetweenReelsMs: 500,
  spinningTimeMs: 2000,
  minBalance: 0,
  maxBalance: 5000,
  reelElements: [
    {
      name: ReelElementName.BAR3,
      image: 'assets/images/3xBAR.png',
    },
    {
      name: ReelElementName.BAR,
      image: 'assets/images/BAR.png',
    },
    {
      name: ReelElementName.BAR2,
      image: 'assets/images/2xBAR.png',
    },
    {
      name: ReelElementName.SEVEN,
      image: 'assets/images/7.png',
    },
    {
      name: ReelElementName.CHERRY,
      image: 'assets/images/Cherry.png',
    },
  ],
  winStates: [
    {
      name: PayTableConditionName.CHERRY_TOP,
      win: 2000,
    },
    {
      name: PayTableConditionName.CHERRY_CENTER,
      win: 1000,
    },
    {
      name: PayTableConditionName.CHERRY_BOTTOM,
      win: 4000,
    },
    {
      name: PayTableConditionName.SEVEN_ANY,
      win: 150,
    },
    {
      name: PayTableConditionName.CHERRY_OR_SEVEN_ANY,
      win: 75,
    },
    {
      name: PayTableConditionName.BAR3_ANY,
      win: 50,
    },
    {
      name: PayTableConditionName.BAR2_ANY,
      win: 20,
    },
    {
      name: PayTableConditionName.BAR_ANY,
      win: 10,
    },
    {
      name: PayTableConditionName.BARS_ANY,
      win: 5,
    }
  ]
};