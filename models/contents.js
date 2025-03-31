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
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      video_url: DataTypes.TEXT,
      thumbnail_url: DataTypes.TEXT,
      is_premium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Doctors',
          key: 'id'
        }
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      tendencia: {
        type: DataTypes.INTEGER,
      }
    },
    {
      timestamps: false,
      tableName: "Contents"
    }
  );

  
  Contents.associate = function(models) {
    // Un contenido pertenece a un autor (doctor)
    Contents.belongsTo(models.Doctors, {
      foreignKey: 'author_id',
      as: 'author'
    });

    // Un contenido pertenece a una categoría
    Contents.belongsTo(models.Categories, {
      foreignKey: 'category_id',
      as: 'category'
    });

    // Un contenido puede tener muchos temas
    Contents.hasMany(models.Topics, {
      foreignKey: 'content',
      as: 'topics'
    });
  };

  return Contents;
};
