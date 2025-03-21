const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      sendAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      sentByUser: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      conversationId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Conversation',
          key: 'conversationId'
        }
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    },
    {
      timestamps: false,
      tableName: "Message"
    }
  );

  Message.associate = function(models) {
    // Un mensaje pertenece a una conversación
    Message.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation'
    });

    // Un mensaje pertenece a un usuario
    Message.belongsTo(models.User, {
      foreignKey: 'user',
      as: 'userDetail'
    });
  };

  return Message;
}; 