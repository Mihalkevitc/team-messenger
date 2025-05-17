// server/routes/chat.routes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Все маршруты чатов требуют аутентификации
router.use(authMiddleware);

// Создание нового чата
router.post('/', chatController.createChat);

// Получение списка чатов пользователя
router.get('/', chatController.getChats); // Express самостоятельно передаёт параметры (req, res) в метод getChats и вывзывает его

module.exports = router;