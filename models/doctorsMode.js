const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DoctorsMode = sequelize.define(
    "DoctorsMode",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Doctors',
          key: 'id'
        }
      },
      mode: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: false,
      tableName: "DoctorsMode"
    }
  );

  DoctorsMode.associate = function(models) {
    DoctorsMode.belongsTo(models.Doctors, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });
  };

  return DoctorsMode;
}; 