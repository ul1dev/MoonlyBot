export const newRefarralMessage = (username?: string) =>
  `🎉 <b>Пользователь ${username ? `@${username} ` : ''}зарегистрировался по вашей реферальной ссылке, вы получили 100 Кионов!</b>`;

export const newRefarralMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: 'Открыть MoonlyApp',
        web_app: {
          url: process.env.APP_URL,
        },
      },
    ],
  ],
});
