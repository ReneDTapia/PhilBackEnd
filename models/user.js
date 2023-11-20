// models/user.js

const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    User.associate = function(models) {
        User.belongsToMany(models.Conversation, {
          through: models.Users_Conversation,
          foreignKey: 'Users_id',
          otherKey: 'Conversation_conversationId'
        });
      };

      
    return User;
};

