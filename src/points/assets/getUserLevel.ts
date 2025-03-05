import { LEVEL_BY_TAPS } from '../points.config';

export const getUserLevelByTaps = (tapsCount: number) => {
  const thresholds = Object.keys(LEVEL_BY_TAPS)
    .map(Number)
    .sort((a, b) => a - b);
  const lastThreshold = thresholds[thresholds.length - 1];

  if (tapsCount >= lastThreshold) {
    const baseLevel = LEVEL_BY_TAPS[lastThreshold];
    const excess = tapsCount - lastThreshold;
    const additionalLevels = Math.floor(excess / 200000);
    return baseLevel + additionalLevels;
  } else {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      const threshold = thresholds[i];
      if (tapsCount >= threshold) {
        return LEVEL_BY_TAPS[threshold];
      }
    }
  }

  return 1;
};
