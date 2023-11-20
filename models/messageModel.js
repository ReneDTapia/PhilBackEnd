const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Message extends Model {}

  Message.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
    user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    conversationId: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Message', 
    timestamps: false 
  });

  return Message;
};
