const TelegramBot = require('node-telegram-bot-api');
const ccxt = require('ccxt'); // Hapus aja dulu kalau belum dipake

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Halo! Bot Safana sudah online di Fly.io ✅');
});

console.log('Bot Safana sudah hidup!'); // Buat mastiin bot jalan
