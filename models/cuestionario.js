// models/Cuestionario.js
module.exports = (sequelize, DataTypes) => {
    const Cuestionario = sequelize.define(
      "Cuestionario",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
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
  
    Cuestionario.associate = function(models) {
      // Un cuestionario puede estar relacionado con muchos usuarios a través de Users_Cuestionario
      Cuestionario.belongsToMany(models.Users, {
        through: models.Users_Cuestionario,
        foreignKey: 'Cuestionario_id',
        otherKey: 'Users_id',
        as: 'users'
      });
    };
  
    return Cuestionario;
  };
  