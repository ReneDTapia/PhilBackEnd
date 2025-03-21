const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { UserTopics, User, Topics } = require("../models");

// Obtener todas las relaciones entre usuarios y temas
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userTopics = await UserTopics.findAll({
      include: [
        {
          model: User,
          as: "userDetail",
          attributes: ["id", "username", "email"]
        },
        {
          model: Topics,
          as: "topicDetail",
          attributes: ["id", "title", "description"]
        }
      ]
    });

    res.json(userTopics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener temas completados por usuario
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userTopics = await UserTopics.findAll({
      where: { user: userId },
      include: [
        {
          model: Topics,
          as: "topicDetail",
          attributes: ["id", "title", "description", "thumbnail_url"]
        }
      ]
    });

    res.json(userTopics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener temas completados/no completados por usuario
router.get("/user/:userId/status/:status", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const status = req.params.status === "completed";
    
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userTopics = await UserTopics.findAll({
      where: { 
        user: userId,
        done: status
      },
      include: [
        {
          model: Topics,
          as: "topicDetail",
          attributes: ["id", "title", "description", "thumbnail_url"]
        }
      ]
    });

    res.json(userTopics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Marcar un tema como completado/no completado
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { user, topic, done } = req.body;

    if (user === undefined || topic === undefined || done === undefined) {
      return res.status(400).json({ error: "User ID, Topic ID, and done status are required" });
    }

    // Verificar si el usuario existe
    const userExists = await User.findByPk(user);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar si el tema existe
    const topicExists = await Topics.findByPk(topic);
    if (!topicExists) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Verificar si ya existe la relación
    let userTopic = await UserTopics.findOne({
      where: {
        user,
        topic
      }
    });

    if (userTopic) {
      // Actualizar el estado si ya existe
      userTopic.done = done;
      await userTopic.save();
      return res.json(userTopic);
    }

    // Crear la nueva relación
    userTopic = await UserTopics.create({
      user,
      topic,
      done
    });

    res.status(201).json(userTopic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar el estado de un tema para un usuario
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { done } = req.body;

    if (done === undefined) {
      return res.status(400).json({ error: "Done status is required" });
    }

    const userTopic = await UserTopics.findByPk(id);

    if (!userTopic) {
      return res.status(404).json({ error: "UserTopic relation not found" });
    }

    userTopic.done = done;
    await userTopic.save();

    res.json(userTopic);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una relación entre usuario y tema
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const userTopic = await UserTopics.findByPk(id);

    if (!userTopic) {
      return res.status(404).json({ error: "UserTopic relation not found" });
    }

    await userTopic.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 