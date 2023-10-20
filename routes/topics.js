const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getTopics/:id", async (req, res, id) => {
  try {
    const id = req.params.id;

    sql = `SELECT id, title, description
    FROM "Topics"
    WHERE content = ${id}
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

module.exports = router;