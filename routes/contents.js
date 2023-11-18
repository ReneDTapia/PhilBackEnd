const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getContent/:userId", async (req, res) => {
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

router.get("/getContents", async (req, res) => {
  try {
    sql = `SELECT * FROM "Contents"
    ORDER BY id ASC 
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

router.post("/postContent", async (req, res) => {
  try {
    const { title, description } = req.body;

    const escapedTitle = db.sequelize.escape(title);
    const escapedDescription = db.sequelize.escape(description);

    const sql = `
        INSERT INTO "Contents" ("title", "description")
        VALUES (${escapedTitle}, ${escapedDescription})
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateContent", async (req, res) => {
  try {
    const { id, title, description } = req.body;

    const escapedId = db.sequelize.escape(id);
    const escapedTitle = db.sequelize.escape(title);
    const escapedDescription = db.sequelize.escape(description);

    const sql = `
        UPDATE "Contents"
        SET title = ${escapedTitle}, description = ${escapedDescription}
        WHERE "id" = ${escapedId};
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.UPDATE);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteContent/:contentId", async (req, res) => {
  try {
    const contentId = req.params.contentId;

    // Primero, eliminar referencias en Users_Conversation
    let sql = `DELETE FROM "Contents"
    WHERE "id" = ${contentId}`;

    await db.query(sql, db.Sequelize.QueryTypes.DELETE);

    res.status(200).json({
      message: "Conversation and associated messages deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
