// models/Cuestionario.js
module.exports = (sequelize, DataTypes) => {
  const Cuestionario = sequelize.define(
    "Cuestionario",
    {
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      videoURL: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "Cuestionario", // Agrega esta línea para especificar el nombre de la tabla
    }
  );

  return Cuestionario;
};
