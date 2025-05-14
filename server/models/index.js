const { Sequelize, DataTypes } = require('sequelize'); // Добавляем DataTypes
const config = require('../config/config');

const sequelize = new Sequelize(config.development);

// Импорт моделей
const User = require('./User')(sequelize, DataTypes); // Передаем DataTypes в модели
const Team = require('./Team')(sequelize, DataTypes);
const Chat = require('./chat')(sequelize, DataTypes);
const Message = require('./Message')(sequelize, DataTypes);

// Связи между моделями

// 1. Пользователь может создавать много команд
Team.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
User.hasMany(Team, { foreignKey: 'createdBy' });

// 2. Команда может иметь много участников (многие-ко-многим)
const TeamMember = sequelize.define('TeamMember', {
  role: {
    type: DataTypes.ENUM(
      'backend', 
      'frontend', 
      'designer', 
      'manager', 
      'qa', 
      'devops', 
      'analyst', 
      'product_owner'
    ),
    allowNull: true,
  },
}, {
  timestamps: false // Отключаем автоматические timestamp
});

User.belongsToMany(Team, { through: TeamMember });
Team.belongsToMany(User, { through: TeamMember });

// 3. Чат может быть привязан к команде
Chat.belongsTo(Team, { foreignKey: 'teamId' });
Team.hasMany(Chat, { foreignKey: 'teamId' });

// 4. Чат может иметь много участников (многие-ко-многим)
const ChatParticipant = sequelize.define('ChatParticipant', {}, {
  timestamps: false // Отключаем автоматические timestamp
});

User.belongsToMany(Chat, { through: ChatParticipant });
Chat.belongsToMany(User, { through: ChatParticipant });

// 5. Сообщения принадлежат чату и пользователю
Message.belongsTo(Chat, { foreignKey: 'chatId' });
Chat.hasMany(Message, { foreignKey: 'chatId' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'senderId' });

module.exports = {
  sequelize,
  User,
  Team,
  Chat,
  Message,
  TeamMember,
  ChatParticipant,
};