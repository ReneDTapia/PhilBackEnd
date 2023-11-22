// models/users_emotions.js

module.exports = (sequelize, DataTypes) => {
  const UsersEmotions = sequelize.define(
    "Users_Emotions", // Nombre de la tabla en la base de datos
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Users_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Emotion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Intensity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Users_Emotions", // Nombre de la tabla en la base de datos
      timestamps: false,
    }
  );

  return UsersEmotions;
};
