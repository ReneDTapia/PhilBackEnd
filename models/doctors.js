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
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      address: DataTypes.TEXT,
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      availability: DataTypes.TEXT,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      imageURL: DataTypes.TEXT,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      telefono: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      agenda: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "Doctors"
    }
  );

  Doctors.associate = function(models) {
    // Un doctor puede tener muchos contenidos como autor
    Doctors.hasMany(models.Contents, {
      foreignKey: 'author_id',
      as: 'authoredContents'
    });

    // Un doctor puede pertenecer a muchas categorías a través de DoctorCategories
    Doctors.belongsToMany(models.Categories, {
      through: models.DoctorCategories,
      foreignKey: 'doctor_id',
      otherKey: 'category_id',
      as: 'categories'
    });

    // Un doctor puede tener muchas reseñas
    Doctors.hasMany(models.DoctorReviews, {
      foreignKey: 'doctor_id',
      as: 'reviews'
    });

    // Un doctor puede tener muchos modos
    Doctors.hasMany(models.DoctorsMode, {
      foreignKey: 'doctor_id',
      as: 'modes'
    });
  };

  return Doctors;
};
