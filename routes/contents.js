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
        COUNT(CASE WHEN done = true THEN true ELSE NULL END) * 1.0 / NULLIF(COUNT(*), 0) AS proporcion
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

module.exports = router;
