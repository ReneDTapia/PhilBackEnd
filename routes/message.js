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

router.post("/addMessage", async (req, res) => {
  try {
      
      const { text, sentByUser, user, conversationId } = req.body;

      if (!text || typeof sentByUser === 'undefined' || !user || !conversationId) {
          return res.status(400).json({ error: "Please provide all required fields" });
      }

      
      const escapedText = db.sequelize.escape(text);
      const escapedSentByUser = db.sequelize.escape(sentByUser);
      const escapedUser = db.sequelize.escape(user);
      const escapedConversationId = db.sequelize.escape(conversationId);


      const sql = `
          INSERT INTO "Message" ("text", "sendAt", "sentByUser", "user", "conversationId")
          VALUES (${escapedText}, NOW(), ${escapedSentByUser}, ${escapedUser}, ${escapedConversationId})
          RETURNING id;  
      `;


      const result = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

      res.status(201).json({ messageId: result[0] });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



module.exports = router;
