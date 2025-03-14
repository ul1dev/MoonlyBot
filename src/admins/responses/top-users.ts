export const topUsersMessage = (topUsers: any[], byTitle = 'тапам') => {
  let message = `<b>🏆 Топ 3 игроков по ${byTitle}</b>`;

  topUsers.forEach((user, index) => {
    const medal =
      index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '';

    message += `\n\n${medal}<b>#${index + 1} ${user.userName ?? user.firstName}</b>
Тапов: <code>${user.tapsCount}</code>
Поинтов: <code>${user.pointsBalance}</code>
Коинов: <code>${user.coinsBalance}</code>
Бустов: <code>${user.boostsBalance}</code>
Уровень: <code>${user.level}</code>
Приглашений: <code>${user.invitedUsersCount}</code>
Регистрация: <code>${user.registrationDate.toLocaleDateString('ru-RU')}</code>
Устройство: <code>${user.os} • ${user.device}</code>`;
  });

  return message;
};
