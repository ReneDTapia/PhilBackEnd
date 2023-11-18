const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getTopics/:userId/:id", async (req, res) => {
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

router.get("/getUserResult/:userId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.params.userId;

    sql = `SELECT COUNT(*)::int AS UserResult
    FROM "UserTopics"
    WHERE "user" = ${userId} AND "topic" = ${id}`;
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

router.post("/CheckTopic", async (req, res) => {
  try {
    const { user, topic, done } = req.body;

    const escapedUser = db.sequelize.escape(user);
    const escapedTopic = db.sequelize.escape(topic);
    const escapedDone = db.sequelize.escape(done);

    const sql = `
        INSERT INTO "UserTopics" ("done", "user", "topic")
        VALUES (${escapedDone}, ${escapedUser}, ${escapedTopic})
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/UpdateDone", async (req, res) => {
  try {
    const { user, topic, done } = req.body;

    const escapedUser = db.sequelize.escape(user);
    const escapedTopic = db.sequelize.escape(topic);
    const escapedDone = db.sequelize.escape(done);

    const sql = `
      UPDATE "UserTopics"
      SET done = ${escapedDone}
      WHERE "user" = ${escapedUser} AND "topic" = ${escapedTopic};
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.UPDATE);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getTopics/:id", async (req, res) => {
  try {
    const id = req.params.id;

    sql = `SELECT * FROM "Topics"
    WHERE "Topics"."content" = ${id}
    ORDER BY id ASC `;
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

router.post("/postTopic", async (req, res) => {
  try {
    const { title, description, content } = req.body;

    const escapedTitle = db.sequelize.escape(title);
    const escapedDescription = db.sequelize.escape(description);
    const escapedContent = db.sequelize.escape(content);

    const sql = `
        INSERT INTO "Topics" ("title", "description", "content")
        VALUES (${escapedTitle}, ${escapedDescription}, ${escapedContent})
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateTopic", async (req, res) => {
  try {
    const { id, title, description, content } = req.body;

    const escapedId = db.sequelize.escape(id);
    const escapedTitle = db.sequelize.escape(title);
    const escapedDescription = db.sequelize.escape(description);
    const escapedContent = db.sequelize.escape(content);

    const sql = `
        UPDATE "Topics"
        SET title = ${escapedTitle}, description = ${escapedDescription}, content = ${escapedContent}
        WHERE "id" = ${escapedId};
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.UPDATE);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteTopic/:topicId", async (req, res) => {
  try {
    const topicId = req.params.topicId;

    // Primero, eliminar referencias en Users_Conversation
    let sql = `DELETE FROM "Topics"
    WHERE "id" = ${topicId}`;

    await db.query(sql, db.Sequelize.QueryTypes.DELETE);

    res.status(200).json({
      message: "Conversation and associated messages deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
