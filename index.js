const ccxt = require('ccxt');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const ccxt = require('ccxt'); // Baris 1
const TelegramBot = require('node-telegram-bot-api'); // Baris 2
const fs = require('fs'); // Baris 3
const express = require('express'); // <-- TAMBAH IKI NANG BARIS 4
const app = express(); // <-- TAMBAH IKI NANG BARIS 5
// === BACA CONFIG.JSON PUNYA LU, TANPA DIRUBAH ===
const config = JSON.parse(fs.readFileSync('./config.json'));

const TELEGRAM_TOKEN = config.notifications.telegram_token;
const CHAT_ID = config.notifications.telegram_chat_id;
const EXCHANGE = new ccxt.binance({ 
    apiKey: config.api_key, 
    secret: config.api_secret, 
    enableRateLimit: true,
    options: { defaultType: 'spot' }
});

// === STATE BOT SAMA PERSIS KAYA PUNYA LU ===
let bot_state = {
    "mode": "OFF", // OFF, START, STOP, CUT
    "bapak_status": "AMAN", // AMAN, -50%
    "bapak_tp": false,
    "anak_aktif": false,
    "level": 0,
    "pnl": 0.0
};

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// === KEEP ALIVE BIAR GAK TIDUR DI FLY.IO ===
setInterval(() => {}, 60000);

// === TOMBOL ===
function main_keyboard() {
    const keyboard = [
        [{ text: "1. Start DCA", callback_data: "start" }],
        [{ text: "2. STOP", callback_data: "stop" }],
        [{ text: "3. Status", callback_data: "status" }],
    ];
    if (bot_state.bapak_status === "-50%") {
        keyboard.push([{ text: "4. CUT", callback_data: "cut" }]);
    }
    return { reply_markup: { inline_keyboard: keyboard } };
}

// === LOGIKA INTI BOT ===
async function dca_engine() {
    while (true) {
        if (bot_state.mode === "OFF") {
            await new Promise(r => setTimeout(r, 1000));
            continue;
        }

        bot_state.level += 1;
        bot_state.pnl -= 1.5; // SIMULASI

        if (bot_state.pnl <= -50 && bot_state.bapak_status === "AMAN") {
            bot_state.bapak_status = "-50%";
            await EXCHANGE.close();
            await bot.sendMessage(CHAT_ID, "🚨 BAPAK AMBRUK -50% 🚨\nPencet tombol CUT buat panggil Anak.", main_keyboard());
        }

        if (bot_state.pnl >= 5) {
            bot_state.bapak_tp = true;
            if (bot_state.mode === "STOP") {
                await EXCHANGE.close();
                await bot.sendMessage(CHAT_ID, "✅ Bapak sudah dijemput. Jual semua. Bot MATI TOTAL.");
                bot_state.mode = "OFF";
            } else if (bot_state.mode === "CUT") {
                await EXCHANGE.close();
                await bot.sendMessage(CHAT_ID, "✅ Bapak sudah dijemput. Jual semua. Lanjut kerja UNLIMITED.");
                bot_state.bapak_tp = false;
                bot_state.pnl = 0;
            }
        }
        await new Promise(r => setTimeout(r, 5000));
    }
}

// === HANDLER TELEGRAM ===
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(CHAT_ID, "Bot DCA V5.2 Siap.", main_keyboard());
});

bot.on('callback_query', async (query) => {
    await bot.answerCallbackQuery(query.id);
    
    if (query.data === "start") {
        bot_state.mode = "START";
        bot_state.bapak_status = "AMAN";
        bot_state.anak_aktif = false;
        await bot.editMessageText("1. Start DCA: Bapak Kerja UNLIMITED ♾️", { chat_id: CHAT_ID, message_id: query.message_id, ...main_keyboard() });
    } else if (query.data === "stop") {
        bot_state.mode = "STOP";
        bot_state.anak_aktif = true;
        await bot.editMessageText("2. STOP: Panggil Anak. Bakal mati total pas Bapak TP Sesi 1.", { chat_id: CHAT_ID, message_id: query.message_id, ...main_keyboard() });
    } else if (query.data === "cut") {
        bot_state.mode = "CUT";
        bot_state.anak_aktif = true;
        await bot.editMessageText("4. CUT: Anak Turun. Bakal lanjut UNLIMITED pas Bapak TP Sesi 1.", { chat_id: CHAT_ID, message_id: query.message_id, ...main_keyboard() });
    } else if (query.data === "status") {
        const text = `**STATUS BOT**\nMode: ${bot_state.mode}\nBapak: ${bot_state.bapak_status}\nLevel: ${bot_state.level}\nPnL: ${bot_state.pnl.toFixed(2)}%`;
        await bot.editMessageText(text, { chat_id: CHAT_ID, message_id: query.message_id, ...main_keyboard() });
    }
const PORT = process.env.PORT || 8080; // Baris 107
app.get("/", (req, res) => res.send("Bot DCA is alive")); // Baris 108
app.listen(PORT, '0.0.0.0', () => console.log(`Server on ${PORT}`)); // Baris 109
});

dca_engine();
