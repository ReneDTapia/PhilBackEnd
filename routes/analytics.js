// controllers/usersEmotionsController.js

const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getUserAnal/:Users_id", async (req, res) => {
  try {
    const Users_id = req.params.Users_id;

    const emotions = await db.UsersEmotions.findAll({
      attributes: [
        "idUsersEmotion",
        "Users_id",
        "Emotions_idEmotion",
        "Percentage",
      ],
      where: {
        Users_id: Users_id,
      },
    });

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
