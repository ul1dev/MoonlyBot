import { LEVEL_BY_TAPS } from '../points.config';
import BigNumber from 'bignumber.js';

export const getUserLevelByTaps = (tapsCount: BigNumber) => {
  const thresholds = Object.keys(LEVEL_BY_TAPS)
    .map((key) => new BigNumber(key))
    .sort((a, b) => a.comparedTo(b));

  if (thresholds.length === 0) return 1;

  const lastThreshold = thresholds[thresholds.length - 1];

  if (tapsCount.gte(lastThreshold)) {
    const baseLevel = LEVEL_BY_TAPS[lastThreshold.toString()];
    const excess = tapsCount.minus(lastThreshold);
    const additionalLevels = excess
      .dividedBy(200000)
      .integerValue(BigNumber.ROUND_FLOOR);
    return baseLevel + additionalLevels.toNumber();
  }

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (tapsCount.gte(thresholds[i])) {
      return LEVEL_BY_TAPS[thresholds[i].toString()];
    }
  }

  return 1;
};
