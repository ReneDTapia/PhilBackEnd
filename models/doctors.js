const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Doctors = sequelize.define(
    "Doctors",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      availability: DataTypes.STRING,
      description: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: false,
    }
  );

  return Doctors;
};
