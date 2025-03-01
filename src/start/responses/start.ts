export const startMessage = () =>
  `<b>Добро пожаловать в MoonlyBot</b> — больше чем просто "тапалка".`;

export const startMarkup = {
  inline_keyboard: [
    [{ text: 'Открыть MoonlyApp', url: 'http://192.168.0.12:3000' }],
  ],
};
