const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Categories = sequelize.define(
    "Categories",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      emoji: DataTypes.STRING,
      color: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );

  return Categories;
};
