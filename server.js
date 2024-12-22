const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// Токен вашего бота
const TOKEN = '7622813957:AAFxx96G-rbcitYzcov6JHMYlqWDBBZm0ac';
const WEB_APP_URL = '';

// Создаем экземпляр бота
const bot = new TelegramBot(TOKEN, { polling: true });

// Создаем сервер Express
const app = express();

// Настраиваем статику для раздачи HTML файла
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для корневой страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        inline_keyboard: [
            [{ text: "Open Web App", web_app: { url: WEB_APP_URL } }]
        ]
    };
    bot.sendMessage(chatId, "Click the button below to open the Web App:", { reply_markup: keyboard });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
