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

      // Formatear las conversaciones para incluir la fecha del último mensaje
      const formattedConversations = conversations.map((conv) => {
        const lastMessageAt = conv.get("lastMessageAt");
        return {
          conversationId: conv.conversationId,
          name: conv.name,
          lastMessageAt: lastMessageAt,
          // Determinar si tiene mensajes
          hasMessages: lastMessageAt !== null
        };
      });

      // Ordenar manualmente:
      // 1. Primero las conversaciones con mensajes (ordenadas por fecha más reciente)
      // 2. Después las conversaciones sin mensajes
      formattedConversations.sort((a, b) => {
        // Si una tiene mensajes y la otra no, la que tiene mensajes va primero
        if (a.hasMessages && !b.hasMessages) return -1;
        if (!a.hasMessages && b.hasMessages) return 1;
        
        // Si ambas tienen mensajes, ordenar por fecha (más reciente primero)
        if (a.hasMessages && b.hasMessages) {
          return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
        }
        
        // Si ninguna tiene mensajes, mantener el orden original
        return 0;
      });

      // Eliminar la propiedad auxiliar hasMessages antes de enviar la respuesta
      const cleanedConversations = formattedConversations.map(conv => {
        const { hasMessages, ...cleanConv } = conv;
        return cleanConv;
      });

      if (cleanedConversations.length > 0) {
        res.json(cleanedConversations);
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