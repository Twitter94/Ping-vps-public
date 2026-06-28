const TelegramBot = require('node-telegram-bot-api');
const ccxt = require('ccxt');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Halo! Bot Safana sudah online di Fly.io ✅');
});

bot.launch();
console.log('Bot Safana sudah hidup!');
