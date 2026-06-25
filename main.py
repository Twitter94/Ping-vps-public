 1 import os
 2 from telegram import Update
 3 from telegram.ext import ApplicationBuilder, CommandHandler,
 4 from binance.client import Client
 5
 6 TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
 7 client = Client()
 8
 9 async def start(update: Update, context: ContextTypes.DEFAULT
10     await update.message.reply_text("✅ Safana ON bang!\nKeti
11
12 async def harga(update: Update, context: ContextTypes.DEFAULT
13     ticker = client.get_symbol_ticker(symbol="BTCUSDT")
14     price = float(ticker["price"])
15     await update.message.reply_text(f"💰 BTC/USDT: ${price:,.
16
17 async def echo(update: Update, context: ContextTypes.DEFAULT_
18     await update.message.reply_text("Ketik /harga bang")
19
20 app = ApplicationBuilder().token(TOKEN).build()
21 app.add_handler(CommandHandler("start", start))
22 app.add_handler(CommandHandler("harga", harga))
23 app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAN
24
25 from aiohttp import web
26 import threading
27
28 async def health_check(request):
29     return web.Response(text="OK")
30
31 app_web = web.Application()
32 app_web.router.add_get('/', health_check)
33
34 def run_web():
35     web.run_app(app_web, port=8080)
36
37 threading.Thread(target=run_web, daemon=True).start()
38 if __name__ == '__main__':
39     print("Bot Safana nyala 🔥")
40     app.run_polling()
41
42
