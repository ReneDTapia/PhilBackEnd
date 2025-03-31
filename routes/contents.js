const db = require("../models/index.js");
const express = require("express");
const { Sequelize, Op } = require("sequelize");
const { Contents, UserTopics, Topics } = require("../models");
const { authenticateToken } = require("./jwt");

const router = express.Router();

router.get("/getContents", authenticateToken, async (req, res) => {
  try {
    // Utiliza el método 'findAll' de Sequelize para obtener todos los contenidos
    const contents = await Contents.findAll({
      order: [["id", "ASC"]], // Ordenar por id de forma ascendente
    });

    if (contents.length > 0) {
      res.json(contents);
    } else {
      res.status(404).json({ error: "No contents found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getContent/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    sql = `SELECT
    "Contents".*,
    (
      SELECT
      CAST(
        COUNT(CASE WHEN done = true THEN true ELSE NULL END) * 1.0 / NULLIF(COUNT(*), 0) AS float
      ) AS proporcion
      FROM (
        SELECT
          "UserTopics"."id" AS user_topic_id,
          "UserTopics"."done" AS done,
          "UserTopics"."user" AS "user",
          "Topics"."id" AS topic,
          "Topics"."title" AS title,
          "Topics"."description" AS description,
          "Topics"."content" AS "content"
        FROM (
          SELECT *
          FROM "UserTopics"
          WHERE "UserTopics"."user" = ${userId}
        ) AS "UserTopics"
        FULL JOIN "Topics" ON "UserTopics"."topic" = "Topics"."id"
        WHERE "Topics"."content" = "Contents"."id"
        ORDER BY "topic" ASC
      ) AS "Total2"
    ) AS proporcion
  FROM "Contents"
  ORDER BY "Contents".id ASC;
  ;
  `;
    const text = await db.query(sql, db.Sequelize.QueryTypes.SELECT);

    if (text.length > 0) {
      res.json(text);
    } else {
      res.status(404).json({ error: "No text was found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); //chocas vuelve a casa porfavor

router.post("/postContent", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    // Utiliza el método 'create' de Sequelize para insertar un nuevo registro
    const newContent = await Contents.create({
      title: title,
      description: description,
    });

    res.status(201).json({ messageId: newContent.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateContent", authenticateToken, async (req, res) => {
  try {
    const { id, title, description } = req.body;

    // Utiliza el método 'update' de Sequelize para realizar la actualización
    const result = await Contents.update(
      {
        title: title,
        description: description,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete(
  "/deleteContent/:contentId",
  authenticateToken,
  async (req, res) => {
    try {
      const contentId = req.params.contentId;

      // Utiliza el método 'destroy' de Sequelize para eliminar el registro
      await Contents.destroy({
        where: {
          id: contentId,
        },
      });

      res.status(200).json({
        message: "Content deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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
          attributes: [] // No queremos los datos completos del topic, solo contarlos
        }
      ],
      group: ['Contents.id', 'Contents.title', 'Contents.thumbnail_url', 'Contents.tendencia'],
      order: [[Sequelize.literal('"tendencia"'), 'DESC']],
      limit: 3
    });

    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/increaseTendencia/:contentId", authenticateToken, async (req, res) => {
  try {
    const { contentId } = req.params;

    // Obtiene el contenido primero
    const content = await Contents.findByPk(contentId);

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Si tendencia es null, ponla en 1; si no, súmale 1
    const newTendencia = content.tendencia === null ? 1 : content.tendencia + 1;

    // Actualiza el valor
    await Contents.update(
      { tendencia: newTendencia },
      { where: { id: contentId } }
    );

    res.status(200).json({
      message: `Tendencia updated to ${newTendencia}`,
      tendencia: newTendencia
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get(
  "/getContentsByCategory/:categoryId",
  authenticateToken,
  async (req, res) => {
    try {
      const { categoryId } = req.params;

      const contents = await Contents.findAll({
        where: {
          category_id: categoryId,
        },
        order: [["id", "ASC"]], // Ordenar por id de forma ascendente
      });

      if (contents.length > 0) {
        res.json(contents);
      } else {
        res.status(404).json({ error: "No contents found for this category" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
