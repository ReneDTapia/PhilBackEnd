/*
CREATE TABLE IF NOT EXISTS public."Emotions"
(
    "idEmotion" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    emotion text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Emotions_pkey" PRIMARY KEY ("idEmotion")
);

*/

module.exports = (sequelize, DataTypes) => {
  const Emotions = sequelize.define(
    "Emotions",
    {
      idEmotion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emotion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
  Emotions.associate = (models) => {
    Emotions.hasMany(models.Pictures_Emotions, {
      foreignKey: 'emotion_id',
      as: 'emotions'
    });
  };
  
  
  return Emotions;
};
