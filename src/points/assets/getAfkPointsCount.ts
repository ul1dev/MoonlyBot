export const getAfkPointsCount = (
  lastLogin: Date,
  boostsBalance: number = 0,
) => {
  const currentDate = new Date();
  const differenceMs = currentDate.getTime() - lastLogin.getTime();
  const differenceMinutes = differenceMs / (1000 * 60);

  if (differenceMinutes < 30) {
    return 0;
  }

  const intervals = Math.floor(differenceMinutes / 30);

  const cappedIntervals = Math.min(intervals, 8);

  return cappedIntervals * 50 * boostsBalance;
};
