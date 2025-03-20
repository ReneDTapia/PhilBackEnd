const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Contents = sequelize.define(
    "Contents",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      video_url: DataTypes.STRING,
      thumbnail_url: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      is_premium: DataTypes.BOOLEAN,
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Doctors", // Nombre del modelo referenciado
          key: "id", // Campo de la tabla referenciada
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories", // Nombre del modelo referenciado
          key: "id", // Campo de la tabla referenciada
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return Contents;
};
