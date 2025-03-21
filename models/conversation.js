const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    "Conversation",
    {
      conversationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    },
    {
      timestamps: false,
      tableName: "Conversation"
    }
  );

  Conversation.associate = function(models) {
    // Una conversación pertenece a un usuario
    Conversation.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Una conversación puede tener muchos mensajes
    Conversation.hasMany(models.Message, {
      foreignKey: 'conversationId',
      as: 'messages'
    });
  };

  return Conversation;
};
