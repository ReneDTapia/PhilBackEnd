const db = require("../models/index.js");
const express = require("express");
const { authenticateToken } = require("./jwt");
const { encrypt, decrypt } = require('./encrypt');
const router = express.Router();

router.get("/getConversation/:conversationId",authenticateToken,async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    const messages = await db.Message.findAll({
      where: { conversationId: conversationId },
      order: [['sendAt', 'ASC']]
    });

    if (messages.length > 0) {
      const decryptedMessages = messages.map(msg => {
        try {
          const encryptedData = JSON.parse(msg.text);
          return {
            ...msg.dataValues,
            text: decrypt(encryptedData) 
          };
        } catch (error) {
          
          console.error("Error al parsear el mensaje encriptado: ", error);
          return msg; 
        }
      });

      res.json(decryptedMessages);
    } else {
      res.status(404).json({ error: "No messages were found for this conversation" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); //putos todos

router.get(
  "/getUserConversations/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      const conversations = await db.Conversation.findAll({
        attributes: [
          "conversationId",
          "name",
          [
            db.Sequelize.fn(
              "MAX",
              db.Sequelize.col("Messages.sendAt")
            ),
            "lastMessageAt",
          ],
        ],
        include: [
          {
            model: db.Message,
            as: "Messages",
            attributes: [],
            where: { user: userId },
            required: false
          },
        ],
        where: { userId: userId },
        group: [
          "Conversation.conversationId",
          "Conversation.name",
        ],
        order: [
          [
            db.Sequelize.fn(
              "MAX",
              db.Sequelize.col("Messages.sendAt")
            ),
            "DESC",
          ],
        ],
      });


      const formattedConversations = conversations.map((conv) => ({
        conversationId: conv.conversationId,
        name: conv.name,
        lastMessageAt: conv.get("lastMessageAt"),
      }));

      if (formattedConversations.length > 0) {
        res.json(formattedConversations);
      } else {
        res
          .status(404)
          .json({ error: "No conversations were found for this user" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.post("/addMessage", authenticateToken, async (req, res) => {
  try {
    const { text, sentByUser, user, conversationId } = req.body;

    if (!text || typeof sentByUser === "undefined" || !user || !conversationId) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }


    const conversationExists = await db.Conversation.findByPk(conversationId);
    if (!conversationExists) {
      return res.status(404).json({ error: "Conversation not found" });
    }

 
    const encryptedMessage = encrypt(text);

   
    const encryptedText = JSON.stringify({
      iv: encryptedMessage.iv,
      content: encryptedMessage.content
    });

    const newMessage = await db.Message.create({
      text: encryptedText, 
      sendAt: new Date(),
      sentByUser: sentByUser,
      user: user,
      conversationId: conversationId
    });

    res.status(201).json({ 
      messageId: newMessage.id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/addConversation", authenticateToken, async (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({
        error: "Please provide both the conversation name and the user ID",
      });
    }
    
    const newConversation = await db.Conversation.create({
      name: name,
      userId: userId  
    });

    res.status(201).json({ conversationId: newConversation.conversationId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//delete
router.delete(
  "/deleteConversation/:conversationId",
  authenticateToken,
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;

      await db.Message.destroy({ where: { conversationId: conversationId } });

      await db.Conversation.destroy({
        where: { conversationId: conversationId },
      });

      res.status(200).json({
        message: "Conversation and associated messages deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


router.put(
  "/updateConversationName/:conversationId",
  authenticateToken,
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Please provide a new name" });
      }

      const updated = await db.Conversation.update(
        { name: name },
        {
          where: { conversationId: conversationId },
          returning: true,
        }
      );

      if (updated[0] > 0) {
        res.json({ success: "Conversation name updated successfully" });
      } else {
        res.status(404).json({ error: "Conversation not found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
