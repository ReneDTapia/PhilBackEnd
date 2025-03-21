const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Sections = sequelize.define(
    "Sections",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: DataTypes.TEXT,
      video: DataTypes.TEXT,
      image: DataTypes.TEXT,
      topic: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Topics',
          key: 'id'
        }
      }
    },
    {
      timestamps: false,
      tableName: "Sections"
    }
  );

  Sections.associate = function(models) {
    // Una sección pertenece a un tema
    Sections.belongsTo(models.Topics, {
      foreignKey: 'topic',
      as: 'topicDetail'
    });
  };

  return Sections;
};
