const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Pictures = sequelize.define(
    "Pictures",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      url: DataTypes.STRING,
      user: DataTypes.STRING,
      Date: DataTypes.DATE, 
    },
    {
      timestamps: false,
    }
  );
  Pictures.associate = (models) => {
    Pictures.hasMany(models.Pictures_Emotions, {
      foreignKey: 'pictures_id',
      as: 'pictures'
    });
  };
  
  return Pictures;
};