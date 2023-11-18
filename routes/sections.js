const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getSections/:id", async (req, res, id) => {
  try {
    const id = req.params.id;

    sql = `SELECT id, text, video, image
    FROM "Sections"
    WHERE topic = ${id}
    ORDER BY id ASC`;
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

router.post("/postSection", async (req, res) => {
  try {
    const { text, video, image, topic } = req.body;

    const escapedText = db.sequelize.escape(text);
    const escapedVideo = db.sequelize.escape(video);
    const escapedImage = db.sequelize.escape(image);
    const escapedTopic = db.sequelize.escape(topic);

    const sql = `
        INSERT INTO "Sections" ("text", "video", "image", "topic")
        VALUES (${escapedText}, ${escapedVideo}, ${escapedImage}, ${escapedTopic})
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateSection", async (req, res) => {
  try {
    const { id, text, video, image, topic } = req.body;

    const escapedId = db.sequelize.escape(id);
    const escapedText = db.sequelize.escape(text);
    const escapedVideo = db.sequelize.escape(video);
    const escapedImage = db.sequelize.escape(image);
    const escapedTopic = db.sequelize.escape(topic);

    const sql = `
        UPDATE "Sections"
        SET text = ${escapedText}, video = ${escapedVideo}, image = ${escapedImage}, topic = ${escapedTopic}
        WHERE "id" = ${escapedId};
      `;

    const result = await db.query(sql, db.Sequelize.QueryTypes.UPDATE);

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteSection/:sectionId", async (req, res) => {
  try {
    const sectionId = req.params.sectionId;

    // Primero, eliminar referencias en Users_Conversation
    let sql = `DELETE FROM "Sections"
    WHERE "id" = ${sectionId}`;

    await db.query(sql, db.Sequelize.QueryTypes.DELETE);

    res.status(200).json({
      message: "Conversation and associated messages deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
