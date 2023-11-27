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

    const result = await Contents.findAll({
      attributes: [
        "id",
        "title",
        "description",
        [
          Sequelize.literal(`COALESCE(
          (
            SELECT
              CAST(
                COUNT(CASE WHEN "UserTopics"."done" = true THEN true ELSE NULL END) * 1.0 / NULLIF(COUNT(*), 0) AS float
              ) AS proporcion
            FROM "UserTopics"
            JOIN "Topics" ON "UserTopics"."topic" = "Topics"."id"
            WHERE "Topics"."content" = "Contents"."id"
              AND "UserTopics"."user" = ${userId}
          ), 0
        )`),
          "proporcion",
        ],
      ],
      order: [["id", "ASC"]],
    });

    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ error: "No text was found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
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

module.exports = router;
