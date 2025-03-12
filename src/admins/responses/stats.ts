export const statsMessage = ({
  totalUsers,
  newUsersToday,
  newUsersWeek,
  newUsersMonth,
  avgTaps,
  avgPoints,
  avgCoins,
  avgBoosts,
  avgLevel,
  avgInvites,
  onlineUsersToday,
  onlineUsersWeek,
  onlineUsersMonth,
  topOS,
  topDevice,
}) => `<b>📊 Статистика Moonly App</b>

👥 <b>Пользователи</b>
├ Всего: <code>${totalUsers}</code>
└ Новые за:
   ├ Сегодня: <code>${newUsersToday}</code>
   ├ Неделю: <code>${newUsersWeek}</code>
   └ Месяц: <code>${newUsersMonth}</code>

📈 <b>Средние показатели</b>
├ Тапов: <code>${avgTaps}</code>
├ Поинтов: <code>${avgPoints}</code>
├ Монет: <code>${avgCoins}</code>
├ Бустов: <code>${avgBoosts}</code>
├ Уровень: <code>${avgLevel}</code>
└ Приглашений: <code>${avgInvites}</code>

🏃 <b>Активность</b>
└ Онлайн за:
   ├ Сегодня: <code>${onlineUsersToday}</code>
   ├ Неделю: <code>${onlineUsersWeek}</code>
   └ Месяц: <code>${onlineUsersMonth}</code>

🌍 <b>Популярное</b>
├ ОС: <code>${topOS}</code>
└ Устройство: <code>${topDevice}</code>`;
