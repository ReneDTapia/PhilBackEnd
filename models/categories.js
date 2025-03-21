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
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      emoji: DataTypes.TEXT,
      color: DataTypes.TEXT,
    },
    {
      timestamps: false,
      tableName: "Categories"
    }
  );

  Categories.associate = function(models) {
    // Una categoría puede tener muchos contenidos
    Categories.hasMany(models.Contents, {
      foreignKey: 'category_id',
      as: 'contents'
    });

    // Una categoría puede estar relacionada con muchos doctores a través de DoctorCategories
    Categories.belongsToMany(models.Doctors, {
      through: models.DoctorCategories,
      foreignKey: 'category_id',
      otherKey: 'doctor_id',
      as: 'doctors'
    });
  };

  return Categories;
};
