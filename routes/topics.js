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

    sql = `SELECT COUNT(*) AS UserResult
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

module.exports = router;
