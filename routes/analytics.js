// controllers/usersEmotionsController.js

const db = require("../models/index.js");
const express = require("express");
const { authenticateToken } = require("./jwt");
const router = express.Router();
const { Op } = require('sequelize');
const { User, Pictures_Emotions, Emotions, Pictures } = require("../models");

router.post("/AddPicturesEmotion", async (req, res) => {
  try {
    const { emotion_id, pictures_id } = req.body;

    // Validar los datos, asegurándose de que ninguno esté vacío
    if (!emotion_id || !pictures_id) {
      return res
        .status(400)
        .json({ error: "Los campos 'emotion_id' y 'pictures_id' son requeridos" });
    }

    // Comprobar si la emoción y la imagen existen
    const emotionExists = await Emotions.findByPk(emotion_id);
    const pictureExists = await Pictures.findByPk(pictures_id);

    if (!emotionExists || !pictureExists) {
      return res
        .status(404)
        .json({ error: "Emoción o imagen no encontrada" });
    }

    // Crear una nueva relación en la base de datos
    const newPicturesEmotion = await Pictures_Emotions.create({ emotion_id, pictures_id });

    // Devuelve la relación creada
    res.status(201).json({
      message: "Relación entre imagen y emoción agregada exitosamente",
      picturesEmotion: newPicturesEmotion
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

router.get("/getUserEmotions/:userId/:days", async (req, res) => {
  try {
    const { userId, days } = req.params;

    // Verificar si los parámetros son válidos
    if (!userId || !days) {
      return res.status(400).json({ error: "Los parámetros 'userId' y 'days' son requeridos" });
    }

    // Crear la cadena del intervalo en JavaScript
    const interval = `${days} days`;

    // Ejecutar la consulta SQL
    const emotionsPercentage = await db.sequelize.query(`
      SELECT 
        E.emotion,
        COUNT(E.emotion) * 100.0 / SUM(COUNT(E.emotion)) OVER () AS EmotionPercentage
      FROM 
        public."Pictures" AS P
      JOIN 
        public."Pictures_Emotions" AS PE ON P.id = PE.pictures_id
      JOIN 
        public."Emotions" AS E ON PE.emotion_id = E."idEmotion"
      WHERE 
        P."user" = :userId 
        AND P."Date" >= CURRENT_DATE - INTERVAL :interval
      GROUP BY 
        E.emotion
      ORDER BY 
        COUNT(E.emotion) DESC
    `, {
      replacements: { userId, interval },
      type: db.sequelize.QueryTypes.SELECT
    });

    // Verificar si se encontraron resultados
    if (emotionsPercentage.length > 0) {
      res.json(emotionsPercentage);
    } else {
      res.status(404).json({ error: "No se encontraron emociones para este usuario en el intervalo especificado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
