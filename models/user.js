// models/user.js

const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'createdAt'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updatedAt'
      }
    },
    {
      timestamps: true,
      tableName: "Users"
    }
  );

  User.associate = function(models) {
    // Un usuario puede tener muchas relaciones con temas
    User.hasMany(models.UserTopics, {
      foreignKey: "user",
      as: "userTopics"
    });

    // Un usuario puede tener muchas conversaciones
    User.hasMany(models.Conversation, {
      foreignKey: "userId",
      as: "conversations"
    });

    // Un usuario puede tener muchos mensajes
    User.hasMany(models.Message, {
      foreignKey: "user",
      as: "messages"
    });

    // Un usuario puede tener muchas relaciones con cuestionarios
    User.hasMany(models.Users_Cuestionario, {
      foreignKey: "Users_id",
      as: "userCuestionarios"
    });

    // Un usuario puede hacer muchas reseñas de doctores
    User.hasMany(models.DoctorReviews, {
      foreignKey: "user_id",
      as: "doctorReviews"
    });

    // Un usuario puede estar relacionado con muchos temas a través de UserTopics
    User.belongsToMany(models.Topics, {
      through: models.UserTopics,
      foreignKey: 'user',
      otherKey: 'topic',
      as: 'topics'
    });
    
    // Un usuario puede responder a muchos cuestionarios
    User.belongsToMany(models.Cuestionario, {
      through: models.Users_Cuestionario,
      foreignKey: 'Users_id',
      otherKey: 'Cuestionario_id',
      as: 'cuestionarios'
    });
  };

  return User;
};
