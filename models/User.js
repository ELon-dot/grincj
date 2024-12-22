const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    registrationDate: { type: Date, required: true }
});

module.exports = mongoose.model('User', UserSchema);
