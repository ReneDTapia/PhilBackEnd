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
      done: DataTypes.BOOLEAN,
      user: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Nombre del modelo referenciado
          key: "id", // Campo de la tabla referenciada
        },
      },
      topic: {
        type: DataTypes.INTEGER,
        references: {
          model: "Topics", // Nombre del modelo referenciado
          key: "id", // Campo de la tabla referenciada
        },
      },
    },
    {
      timestamps: false,
    }
  );

  UserTopics.belongsTo(sequelize.models.Topics, {
    foreignKey: "topic",
    targetKey: "id",
  });

  return UserTopics;
};
