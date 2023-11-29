// controllers/usersEmotionsController.js

const db = require("../models/index.js");
const express = require("express");
const { authenticateToken } = require("./jwt");
const router = express.Router();
const { Op } = require("sequelize");
const { User, Pictures_Emotions, Emotions, Pictures } = require("../models");

router.post("/AddPicturesEmotion", async (req, res) => {
  try {
    const { emotion_id, pictures_id } = req.body;

    // Validar los datos, asegurándose de que ninguno esté vacío
    if (!emotion_id || !pictures_id) {
      return res
        .status(400)
        .json({
          error: "Los campos 'emotion_id' y 'pictures_id' son requeridos",
        });
    }

    // Crear una nueva relación en la base de datos
    const newPicturesEmotion = await Pictures_Emotions.create({
      emotion_id,
      pictures_id,
    });

    // Devuelve la relación creada
    res.status(201).json({
      message: "Relación entre imagen y emoción agregada exitosamente",
      picturesEmotion: newPicturesEmotion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/getUserAnal/:Users_id", async (req, res) => {
  try {
    const Users_id = req.params.Users_id;

    const emotions = await db.UsersEmotions.findAll({
      attributes: [
        "idUsersEmotion",
        "Users_id",
        "Emotions_idEmotion",
        "Percentage",
      ],
      where: {
        Users_id: Users_id,
      },
    });

    if (emotions.length > 0) {
      res.json(emotions);
    } else {
      res.status(404).json({ error: "No emotions were found for this user" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// controllers/usersEmotionsController.js
router.get("/getUserEmotions/:userId/:days?", async (req, res) => {
  try {
    const { userId, days } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "El parámetro 'userId' es requerido" });
    }

    let whereCondition = {
      user: userId,
    };

    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      whereCondition.Date = {
        [Op.gte]: startDate,
      };
    }

    // Obtener el total de registros de emociones
    const totalEmotionsCount = await db.Pictures_Emotions.count({
      include: [
        {
          model: db.Pictures,
          as: "pictures",
          where: whereCondition,
        },
      ],
    });

    // Obtener el conteo de cada emoción
    const emotionsData = await db.Pictures_Emotions.findAll({
      include: [
        {
          model: db.Pictures,
          as: "pictures",
          where: whereCondition,
          attributes: [],
        },
        {
          model: db.Emotions,
          as: "emotions",
          attributes: ["emotion"],
        },
      ],
      attributes: [
        "emotions.emotion",
        [
          db.Sequelize.fn("COUNT", db.Sequelize.col("emotion_id")),
          "emotionCount",
        ],
      ],
      group: ["emotions.emotion"],
      raw: true,
    });

    // Calcular el porcentaje de cada emoción
    const emotionspercentage = emotionsData.map((item) => ({
      emotion: item["emotions.emotion"],
      emotionpercentage: (
        (item.emotionCount / totalEmotionsCount) *
        100
      ).toFixed(10),
    }));

    res.json(emotionspercentage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
