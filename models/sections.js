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
      text: DataTypes.STRING,
      video: DataTypes.STRING,
      image: DataTypes.STRING,
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

  // Asociación con la tabla "Topics"
  Sections.belongsTo(sequelize.models.Topics, {
    foreignKey: "topic",
    targetKey: "id",
  });

  return Sections;
};
