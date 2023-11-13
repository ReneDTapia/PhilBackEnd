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
          SELECT c."conversationId", c.name, MAX(m."sendAt") as "lastMessageAt"
          FROM "Message" m
          JOIN "Conversation" c ON m."conversationId" = c."conversationId"
          WHERE m."user" = ${userId} AND m."conversationId" IS NOT NULL
          GROUP BY c."conversationId", c.name
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

//crear una nueva conversation

router.post("/addConversation", async (req, res) => {
  try {
      const { name } = req.body;

      if (!name) {
          return res.status(400).json({ error: "Please provide the conversation name" });
      }

      const escapedName = db.sequelize.escape(name);

      const sql = `
          INSERT INTO "Conversation" ("name")
          VALUES (${escapedName})
          RETURNING "conversationId";  
      `;

      const result = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

      res.status(201).json({ conversationId: result[0].conversationId });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

//delete

router.delete("/deleteConversation/:conversationId", async (req, res) => {
  try {
      const conversationId = req.params.conversationId;

      // Primero, eliminar todos los mensajes asociados
      let sql = `DELETE FROM "Message" WHERE "conversationId" = ${conversationId};`;
      await db.query(sql, db.Sequelize.QueryTypes.DELETE);

      // Luego, eliminar la conversación
      sql = `DELETE FROM "Conversation" WHERE "conversationId" = ${conversationId};`;
      await db.query(sql, db.Sequelize.QueryTypes.DELETE);

      res.status(200).json({ message: "Conversation and associated messages deleted successfully" });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



module.exports = router;
