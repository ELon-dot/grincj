

const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const User = require('./models/User');

// Токен вашего бота
const TOKEN = '7622813957:AAFxx96G-rbcitYzcov6JHMYlqWDBBZm0ac';
const WEB_APP_URL = 'https://hyenasaber-ja9pcv.stormkit.dev/'; // URL вашего приложения на Stormkit

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/telegram', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

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
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;

    // Получаем дату регистрации пользователя из базы данных
    let user = await User.findOne({ telegramId });

    if (!user) {
        // Если пользователь не найден, сохраняем его с текущей датой
        user = new User({ telegramId, registrationDate: new Date() });
        await user.save();
    }

    const keyboard = {
        inline_keyboard: [
            [{ text: "Open Web App", web_app: { url: `${WEB_APP_URL}?telegramId=${telegramId}` } }]
        ]
    };
    bot.sendMessage(chatId, "Click the button below to open the Web App:", { reply_markup: keyboard });
});
// Маршрут API для получения даты регистрации пользователя
app.get('/api/user/:telegramId', async (req, res) => {
    const telegramId = req.params.telegramId;

    try {
        const user = await User.findOne({ telegramId });
        if (user) {
            res.json({ registrationDate: user.registrationDate });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
