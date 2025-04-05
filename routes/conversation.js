const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { Conversation } = require("../models");

// Obtener todas las conversaciones
router.get("/getConversations", authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      order: [["conversationId", "ASC"]],
    });

    if (conversations.length > 0) {
      res.json(conversations);
    } else {
      res.status(404).json({ error: "No conversations found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una conversación por su ID
router.get("/getConversation/:id", authenticateToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findByPk(conversationId);

    if (conversation) {
      res.json(conversation);
    } else {
      res.status(404).json({ error: "Conversation not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva conversación
router.post("/createConversation", authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newConversation = await Conversation.create({
      name
    });

    res.status(201).json(newConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una conversación
router.put("/updateConversation/:id", authenticateToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { name } = req.body;
    
    const conversation = await Conversation.findByPk(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    await conversation.update({
      name: name || conversation.name
    });
    
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una conversación
router.delete("/deleteConversation/:id", authenticateToken, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findByPk(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    await conversation.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get(
  "/getUserConversations/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      // Obtener todas las conversaciones del usuario
      const conversations = await db.Conversation.findAll({
        attributes: [
          "conversationId",
          "name",
          [
            db.Sequelize.fn(
              "MAX",
              db.Sequelize.col("messages.sendAt")
            ),
            "lastMessageAt",
          ],
        ],
        include: [
          {
            model: db.Message,
            as: "messages",
            attributes: [],
            required: false
          },
        ],
        where: { userId: userId },
        group: [
          "Conversation.conversationId",
          "Conversation.name",
        ]
      });

      // Dividir las conversaciones en dos grupos: con mensajes y sin mensajes
      const withMessages = [];
      const withoutMessages = [];

      conversations.forEach(conv => {
        const lastMessageAt = conv.get("lastMessageAt");
        const formatted = {
          conversationId: conv.conversationId,
          name: conv.name,
          lastMessageAt: lastMessageAt
        };

        if (lastMessageAt) {
          withMessages.push(formatted);
        } else {
          withoutMessages.push(formatted);
        }
      });

      // Ordenar las conversaciones con mensajes por fecha (más reciente primero)
      withMessages.sort((a, b) => {
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      });

      // Combinar los dos arrays: primero con mensajes, después sin mensajes
      const sortedConversations = [...withMessages, ...withoutMessages];

      if (sortedConversations.length > 0) {
        res.json(sortedConversations);
      } else {
        res.status(404).json({ error: "No conversations were found for this user" });
      }
    } catch (err) {
      console.error("Error al obtener conversaciones:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router; 