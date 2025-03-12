export const getCurrentEnergy = (lastUpdate: Date, currentEnergy: number) => {
  const currentTime: number = Date.now();
  const lastUpdateTime: number = lastUpdate.getTime();
  const diffInSeconds: number = Math.floor(
    (currentTime - lastUpdateTime) / 1000,
  );

  const incCountEnergy = diffInSeconds * 3;
  const newCurrEnergy = currentEnergy + incCountEnergy;

  return Math.min(newCurrEnergy, 10000);
};
