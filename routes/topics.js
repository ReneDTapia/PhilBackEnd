const db = require("../models/index.js");
const express = require("express");
const { Sequelize, Op } = require("sequelize");
const { Topics, UserTopics } = require("../models");
const { authenticateToken } = require("./jwt");

const router = express.Router();

router.get("/getTopics/:userId/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.params.userId;

    sql = `SELECT 
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
    RIGHT JOIN "Topics" ON "UserTopics"."topic" = "Topics"."id"
    WHERE "Topics"."content" = ${id}
    ORDER BY "topic" ASC`;
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

router.get(
  "/getUserResult/:userId/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const topicId = req.params.id;

      // Utiliza el método 'count' de Sequelize para contar los registros que cumplen con la condición
      const userResult = await UserTopics.count({
        where: {
          user: userId,
          topic: topicId,
        },
      });

      res.json([{ userresult: userResult }]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post("/CheckTopic", authenticateToken, async (req, res) => {
  try {
    const { user, topic, done } = req.body;

    // Utiliza el método 'create' de Sequelize para insertar un nuevo registro
    const newUserTopic = await UserTopics.create({
      done: done,
      user: user,
      topic: topic,
    });

    res.status(201).json({ messageId: newUserTopic.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/UpdateDone", authenticateToken, async (req, res) => {
  try {
    const { user, topic, done } = req.body;

    // Utiliza el método 'update' de Sequelize para realizar la actualización
    const result = await UserTopics.update(
      { done: done },
      {
        where: {
          user: user,
          topic: topic,
        },
      }
    );

    res.status(201).json({ messageId: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getTopics/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;

    // Utiliza el método 'findAll' de Sequelize con la opción 'where'
    const topics = await Topics.findAll({
      where: {
        content: id,
      },
      order: [["id", "ASC"]],
    });

    if (topics.length > 0) {
      res.json(topics);
    } else {
      res
        .status(404)
        .json({ error: "No topics were found for the given content id" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/postTopic", authenticateToken, async (req, res) => {
  try {
    const { title, description, content } = req.body;

    // Utiliza el método 'create' de Sequelize para insertar un nuevo registro
    const newTopic = await Topics.create({
      title: title,
      description: description,
      content: content,
    });

    res.status(201).json({ messageId: newTopic.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateTopic", authenticateToken, async (req, res) => {
  try {
    const { id, title, description, content } = req.body;

    // Utiliza el método 'update' de Sequelize para realizar la actualización
    const result = await Topics.update(
      {
        title: title,
        description: description,
        content: content,
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

router.delete("/deleteTopic/:topicId", authenticateToken, async (req, res) => {
  try {
    const topicId = req.params.topicId;

    // Utiliza el método 'destroy' de Sequelize para eliminar el registro
    await Topics.destroy({
      where: {
        id: topicId,
      },
    });

    res.status(200).json({
      message: "Topic deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
