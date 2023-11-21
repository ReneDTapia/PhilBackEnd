const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Contents = sequelize.define(
    "Contents",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      timestamps: false,
    }
  );

  return Contents;
};
