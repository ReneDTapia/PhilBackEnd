const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DoctorReviews = sequelize.define(
    "DoctorReviews",
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: false,
      tableName: "DoctorReviews",
      indexes: [
        {
          unique: true,
          fields: ['doctor_id', 'user_id']
        }
      ]
    }
  );

  DoctorReviews.associate = function(models) {
    DoctorReviews.belongsTo(models.Doctors, {
      foreignKey: 'doctor_id',
      as: 'doctor'
    });

    DoctorReviews.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return DoctorReviews;
}; 