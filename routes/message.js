const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getConversation/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    const sql = `
        SELECT * FROM "Message" 
        WHERE "conversationId" = ${conversationId}
        ORDER BY "sendAt" ASC`;

    const messages = await db.query(sql, db.Sequelize.QueryTypes.SELECT);

    if (messages.length > 0) {
      res.json(messages);
    } else {
      res.status(404).json({ error: "No messages were found for this conversation" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getUserConversations/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const sql = `
            SELECT "conversationId", MAX("sendAt") as "lastMessageAt"
            FROM "Message"
            WHERE "user" = ${userId} AND "conversationId" IS NOT NULL
            GROUP BY "conversationId"
            ORDER BY "lastMessageAt" DESC`;


        const conversations = await db.query(sql, db.Sequelize.QueryTypes.SELECT);

        if (conversations.length > 0) {
            res.json(conversations);
        } else {
            res.status(404).json({ error: "No conversations were found for this user" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
