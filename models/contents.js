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
  router.get("/topTrending", authenticateToken, async (req, res) => {
    try {
      const contents = await Contents.findAll({
        where: {
          tendencia: {
            [Op.not]: null
          }
        },
        attributes: [
          'id',
          'title',
          'thumbnail_url',
          'tendencia',
          [Sequelize.fn('COUNT', Sequelize.col('topics.id')), 'topicCount']
        ],
        include: [
          {
            model: Topics,
            as: 'topics',
            attributes: []
          }
        ],
        group: ['Contents.id'],
        order: [['tendencia', 'DESC']],
        limit: 3
      });
  
      res.status(200).json(contents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
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
