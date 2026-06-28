1  const ccxt = require('ccxt');
2  const TelegramBot = require('node-telegram-bot-api');

// === AMBIL DARI SECRETS FLY.IO ===
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const EXCHANGE = new ccxt.binance({
  apiKey: process.env.BINANCE_API_KEY,
  secret: process.env.BINANCE_SECRET_KEY,
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

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true }

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


// === PENGAMAN TELEGRAM ===
bot.onText ( /\/start / , ( msg ) = > {
    bot.sendMessage ( CHAT_ID , " Bot DCA V5.2 Siap." , main_keyboard ( ) ) ;
} ) ;

bot.on ( ' callback_query' , async ( query ) = > { 
    await  bot.answerCallbackQuery ( query.id ) ;​​​​
    
    jika  ( query.data === " start " ) { 
        bot_state.mode = " START " ;
        bot_state . bapak_status = "AMAN" ;
        bot_state . anak_aktif = salah ;
        await  bot.editMessageText ( " 1 . Mulai DCA : Bapak Kerja UNLIMITED ♾️" , { chat_id : CHAT_ID , message_id : query.message_id , ... main_keyboard ( ) } ) ;  
    }  else  if  ( query . data === "stop" )  {
        bot_state.mode = " STOP " ;
        bot_state . anak_aktif = benar ;
        tunggu  bot . editMessageText ( "2. STOP: Panggil Anak. Bakal mati total pas Bapak TP Sesi 1." , {  chat_id : CHAT_ID , message_id : query .message_id , ... main_keyboard ( ) }  ) ;
    }  else  if  ( query . data === "cut" )  {
        bot_state.mode = " CUT " ;
        bot_state . anak_aktif = benar ;
        tunggu  bot . editMessageText ( " 4. CUT: Anak Turun. Bakal lanjut UNLIMITED pas Bapak TP Sesi 1." , {  chat_id : CHAT_ID , message_id : query .message_id , ... main_keyboard ( ) }  ) ;
    }  else  if  ( query . data === "status" )  {
        const  text = `**STATUS BOT** \n Mode: ${ bot_state . mode } \n Bapak: ${ bot_state . bapak_status } \n Level: ${ bot_state . level } \n PnL: ${ bot_state . pnl . toFixed ( 2 ) } %` ;
        await  bot.editMessageText ( text , { chat_id : CHAT_ID , message_id : query.message_id , ... main_keyboard ( ) } ) ;​​​  
    
// === NYALAKAN BOT ===
bot.on('polling_error', (error) => console.log(error));
bot.launch();
console.log('Bot Safana wes urip neng Fly.io!');
