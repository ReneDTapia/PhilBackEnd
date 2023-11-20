const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Users_Conversation extends Model {}

  Users_Conversation.init({
    Users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', 
        key: 'id' 
      }
    },
    idUsers_Conversation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Conversation_conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversation', 
        key: 'conversationId' 
      }
    }
  }, {
    sequelize,
    modelName: 'Users_Conversation',
    tableName: 'Users_Conversation',
    timestamps: false
  });

  Users_Conversation.associate = function(models) {
    Users_Conversation.belongsTo(models.User, {
      foreignKey: 'Users_id',
      as: 'User'
    });
    Users_Conversation.belongsTo(models.Conversation, {
      foreignKey: 'Conversation_conversationId',
      as: 'Conversation'
    });
  };

  

  return Users_Conversation;
};
