// server/controllers/chat.controller.js
const { Chat, User, ChatParticipant, Message, sequelize } = require('../models');

exports.createChat = async (req, res) => {
  try {
    const { name, isTeamChat = false, teamId = null } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Название чата обязательно' });
    }

    const transaction = await sequelize.transaction();

    try {
      const chat = await Chat.create({
        name,
        isTeamChat,
        teamId
      }, { transaction });

      await ChatParticipant.create({
        userId,
        chatId: chat.id
      }, { transaction });

      await transaction.commit();
      res.status(201).json(chat);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Ошибка при создании чата:', error);
    res.status(500).json({ error: 'Не удалось создать чат' });
  }
};

exports.getChats = async (req, res) => {
  try {
    console.log('\n \n \n \n \n \n \n \n \n \nДошли до функции контролера getChats\n Получение чатов пользователя:', req.user.id);
    const userId = req.user.id;

    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          as: 'participants',
          where: { id: userId },
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'content', 'createdAt', 'senderId'],
          include: {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName']
          }
        }
      ]
    });

    // Сортируем вручную по дате последнего сообщения
    chats.sort((a, b) => {
      const dateA = a.messages[0]?.createdAt ? new Date(a.messages[0].createdAt) : 0;
      const dateB = b.messages[0]?.createdAt ? new Date(b.messages[0].createdAt) : 0;
      return dateB - dateA;
    });


    const formattedChats = chats.map(chat => ({
      id: chat.id,
      name: chat.name,
      isTeamChat: chat.isTeamChat,
      lastMessage: chat.messages[0] ? {
        text: chat.messages[0].content,
        sender: chat.messages[0].sender,
        createdAt: chat.messages[0].createdAt
      } : null,
      unreadCount: 0
    }));

    res.json(formattedChats);
  } catch (error) {
    console.error('Ошибка при получении чатов:', error);
    res.status(500).json({ error: 'Не удалось получить список чатов' });
  }
};

// Разные параметры req
// app.get('/api/chats/:chatId', (req, res) => {
//   console.log('Метод:', req.method); // GET
//   console.log('Путь:', req.path); // /api/chats/123
//   console.log('Параметры пути:', req.params.chatId); // 123
//   console.log('Query-параметры:', req.query); // например { page: '2' }
//   console.log('Заголовки:', req.headers.authorization); // Bearer token
// });