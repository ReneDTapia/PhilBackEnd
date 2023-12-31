module.exports = (sequelize, DataTypes) => {
  const Pictures_Emotions = sequelize.define(
    "Pictures_Emotions",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emotion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Emotions",
          key: "idEmotion",
        },
      },
      pictures_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Pictures",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
    }
  );

  
  Pictures_Emotions.associate = (models) => {
    Pictures_Emotions.belongsTo(models.Pictures, {
      foreignKey: 'pictures_id',
      as: 'pictures'
    });
    Pictures_Emotions.belongsTo(models.Emotions, {
      foreignKey: 'emotion_id',
      as: 'emotions'
    });
  };
  
  return Pictures_Emotions;
};

/*CREATE TABLE IF NOT EXISTS public."Pictures_Emotions"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    emotion_id integer NOT NULL,
    CONSTRAINT "Pictures_Emotions_pkey" PRIMARY KEY (id)
); */
