const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Pictures = sequelize.define(
    "Pictures",
    {
      url: DataTypes.STRING,
      user: DataTypes.STRING,
      Date: DataTypes.DATE,
    },
    {
      timestamps: false,
    }
  );

  return Pictures;
};
