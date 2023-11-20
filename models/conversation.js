const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Conversation extends Model {}

  Conversation.init({
    conversationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Conversation',
    tableName: 'Conversation', 
    timestamps: false 
  });

  Conversation.associate = function(models) {
    Conversation.belongsToMany(models.User, {
      through: models.Users_Conversation,
      foreignKey: 'Conversation_conversationId',
      otherKey: 'Users_id'
    });
  };
  

  return Conversation;
};
