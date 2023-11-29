const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Topics = sequelize.define(
    "Topics",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: {
        type: DataTypes.INTEGER,
        references: {
          model: "Contents", // Nombre del modelo referenciado
          key: "id", // Campo de la tabla referenciada
        },
      },
    },
    {
      timestamps: false,
    }
  );

  // Asociación con la tabla "Contents"
  Topics.belongsTo(sequelize.models.Contents, {
    foreignKey: "content",
    targetKey: "id",
  });

  Topics.associate = function (models) {
    Topics.hasMany(models.UserTopics, {
      foreignKey: 'topic',
      as: 'userTopics'
    });
  };

  return Topics;
};
