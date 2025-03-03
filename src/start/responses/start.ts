export const startMessage = () =>
  `<b>Добро пожаловать в MoonlyBot</b> — больше чем просто "тапалка".`;

export const startMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: 'Открыть MoonlyApp',
        web_app: {
          url: process.env.APP_URL,
        },
      },
    ],
    [
      {
        text: 'Комьюнити',
        url: 'https://t.me/moonly_coin',
      },
    ],
  ],
});
