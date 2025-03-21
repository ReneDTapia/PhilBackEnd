const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const UserTopics = sequelize.define(
    "UserTopics",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      topic: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Topics',
          key: 'id'
        }
      }
    },
    {
      timestamps: false,
      tableName: "UserTopics"
    }
  );

  UserTopics.associate = function(models) {
    // UserTopics pertenece a un usuario
    UserTopics.belongsTo(models.User, {
      foreignKey: 'user',
      as: 'userDetail'
    });

    // UserTopics pertenece a un tema
    UserTopics.belongsTo(models.Topics, {
      foreignKey: 'topic',
      as: 'topicDetail'
    });
  };

  return UserTopics;
};
