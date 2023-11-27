const db = require("../models/index.js");
const express = require("express");
const { authenticateToken } = require("./jwt");

const router = express.Router();

router.get(
  "/getConversation/:conversationId",
  authenticateToken,
  async (req, res) => {
    try {
      const conversationId = req.params.conversationId;

      const messages = await db.Message.findAll({
        where: { conversationId: conversationId },
        order: [["sendAt", "ASC"]],
      });

      if (messages.length > 0) {
        res.json(messages);
      } else {
        res
          .status(404)
          .json({ error: "No messages were found for this conversation" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/getUserConversations/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      const conversations = await db.Users_Conversation.findAll({
        attributes: [
          [
            db.Sequelize.fn(
              "MAX",
              db.Sequelize.col("Conversation->Messages.sendAt")
            ),
            "lastMessageAt",
          ],
        ],
        include: [
          {
            model: db.Conversation,
            as: "Conversation",
            attributes: ["conversationId", "name"],
            include: [
              {
                model: db.Message,
                as: "Messages",
                attributes: [],
              },
            ],
          },
        ],
        where: { Users_id: userId },
        group: [
          "Users_Conversation.idUsers_Conversation",
          "Conversation.conversationId",
          "Conversation.name",
        ],
        order: [
          [
            db.Sequelize.fn(
              "MAX",
              db.Sequelize.col("Conversation->Messages.sendAt")
            ),
            "DESC",
          ],
        ],
      });

      // Transformar los resultados para obtener el formato deseado
      const formattedConversations = conversations.map((conv) => ({
        conversationId: conv.Conversation.conversationId,
        name: conv.Conversation.name,
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

    if (
      !text ||
      typeof sentByUser === "undefined" ||
      !user ||
      !conversationId
    ) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const newMessage = await db.Message.create({
      text: text,
      sendAt: new Date(),
      sentByUser: sentByUser,
      user: user,
      conversationId: conversationId,
    });

    res.status(201).json({ messageId: newMessage.id });
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

    const newConversation = await db.Conversation.create({ name: name });
    await db.Users_Conversation.create({
      Users_id: userId,
      Conversation_conversationId: newConversation.conversationId,
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

      await db.Users_Conversation.destroy({
        where: { Conversation_conversationId: conversationId },
      });
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
