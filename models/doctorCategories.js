const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DoctorCategories = sequelize.define(
    "DoctorCategories",
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
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: false,
      tableName: "DoctorCategories",
      indexes: [
        {
          unique: true,
          fields: ['doctor_id', 'category_id']
        }
      ]
    }
  );

  return DoctorCategories;
}; 