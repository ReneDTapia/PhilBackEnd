const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getUserAnal/:Users_id", async (req, res) => {
  try {
    const Users_id = req.params.Users_id;

    sql = `SELECT "idUsersEmotion", "Users_id", "Emotions_idEmotion", "Percentage"
      FROM public."Users_Emotions"
      WHERE "Users_id" = ${Users_id}`;

    const emotions = await db.query(sql, db.Sequelize.QueryTypes.SELECT);

    if (emotions.length > 0) {
      res.json(emotions);
    } else {
      res.status(404).json({ error: "No emotions were found for this user" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
