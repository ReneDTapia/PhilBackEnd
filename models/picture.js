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

  return Pictures;
};

