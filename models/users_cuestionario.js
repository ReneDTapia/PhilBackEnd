// users_cuestionario.js
const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Users_Cuestionario = sequelize.define(
    "Users_Cuestionario",
    {
      Users_Cuestionario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Users_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      Cuestionario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Cuestionario',
          key: 'id'
        }
      },
      Percentage: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "Users_Cuestionario"
    }
  );

  Users_Cuestionario.associate = function(models) {
    Users_Cuestionario.belongsTo(models.User, {
      foreignKey: 'Users_id',
      as: 'userDetail'
    });

    Users_Cuestionario.belongsTo(models.Cuestionario, {
      foreignKey: 'Cuestionario_id',
      as: 'cuestionarioDetail'
    });
  };

  return Users_Cuestionario;
};
