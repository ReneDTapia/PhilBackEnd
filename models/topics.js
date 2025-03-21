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
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      content: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Contents',
          key: 'id'
        }
      },
      thumbnail_url: DataTypes.TEXT
    },
    {
      timestamps: false,
      tableName: "Topics"
    }
  );

  Topics.associate = function(models) {
    // Un tema pertenece a un contenido
    Topics.belongsTo(models.Contents, {
      foreignKey: 'content',
      as: 'contentDetail'
    });

    // Un tema puede tener muchas secciones
    Topics.hasMany(models.Sections, {
      foreignKey: 'topic',
      as: 'sections'
    });

    // Un tema puede estar relacionado con muchos usuarios a través de UserTopics
    Topics.belongsToMany(models.Users, {
      through: models.UserTopics,
      foreignKey: 'topic',
      otherKey: 'user',
      as: 'users'
    });
  };

  return Topics;
};
