export const getCurrentEnergy = (
  lastUpdate: Date,
  currentEnergy: number,
  maxEnergy: number,
) => {
  const currentTime: number = Date.now();
  const lastUpdateTime: number = lastUpdate.getTime();
  const diffInSeconds: number = Math.floor(
    (currentTime - lastUpdateTime) / 3600,
  );

  const incCountEnergy = diffInSeconds;
  const newCurrEnergy = currentEnergy + incCountEnergy;

  return Math.min(newCurrEnergy, maxEnergy);
};
