const db = require("../models/index.js");
const express = require("express");
const { Sequelize, Op } = require("sequelize");
const { Topics, UserTopics } = require("../models");

const router = express.Router();

router.get("/getTopics/:userId/:id", async (req, res) => {
  try {
    const userId = req.params.userId;
    const contentId = req.params.id;

    // Utiliza el método 'findAll' de Sequelize con la opción 'include' para realizar un JOIN
    const userTopics = await UserTopics.findAll({
      where: {
        user: userId,
      },
      include: {
        model: Topics,
        where: {
          content: contentId,
        },
        attributes: ["id", "title", "description", "content"],
      },
      attributes: ["id", "done", "user"],
      order: [
        [{ model: Topics }, "id", "ASC"], // Ordenar por el campo 'id' de 'Topics'
      ],
    });

    // Mapear el resultado para ajustar la estructura del JSON
    const formattedUserTopics = userTopics.map((userTopic) => ({
      user_topic_id: userTopic.id,
      done: userTopic.done,
      user: userTopic.user,
      topic: userTopic.Topic.id,
      title: userTopic.Topic.title,
      description: userTopic.Topic.description,
      content: userTopic.Topic.content,
    }));

    if (formattedUserTopics.length > 0) {
      res.json(formattedUserTopics);
    } else {
      res
        .status(404)
        .json({ error: "No topics were found for the given user and content" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getUserResult/:userId/:id", async (req, res) => {
  try {
    const userId = req.params.userId;
    const topicId = req.params.id;

    // Utiliza el método 'count' de Sequelize para contar los registros que cumplen con la condición
    const userResult = await UserTopics.count({
      where: {
        user: userId,
        topic: topicId,
      },
    });

    res.json([{ userresult: userResult }]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/CheckTopic", async (req, res) => {
  try {
    const { user, topic, done } = req.body;

    // Utiliza el método 'create' de Sequelize para insertar un nuevo registro
    const newUserTopic = await UserTopics.create({
      done: done,
      user: user,
      topic: topic,
    });

    res.status(201).json({ messageId: newUserTopic.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/UpdateDone", async (req, res) => {
  try {
    const { user, topic, done } = req.body;

    // Utiliza el método 'update' de Sequelize para realizar la actualización
    const result = await UserTopics.update(
      { done: done },
      {
        where: {
          user: user,
          topic: topic,
        },
      }
    );

    res.status(201).json({ messageId: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getTopics/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Utiliza el método 'findAll' de Sequelize con la opción 'where'
    const topics = await Topics.findAll({
      where: {
        content: id,
      },
      order: [["id", "ASC"]],
    });

    if (topics.length > 0) {
      res.json(topics);
    } else {
      res
        .status(404)
        .json({ error: "No topics were found for the given content id" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/postTopic", async (req, res) => {
  try {
    const { title, description, content } = req.body;

    // Utiliza el método 'create' de Sequelize para insertar un nuevo registro
    const newTopic = await Topics.create({
      title: title,
      description: description,
      content: content,
    });

    res.status(201).json({ messageId: newTopic.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateTopic", async (req, res) => {
  try {
    const { id, title, description, content } = req.body;

    // Utiliza el método 'update' de Sequelize para realizar la actualización
    const result = await Topics.update(
      {
        title: title,
        description: description,
        content: content,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(201).json({ messageId: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteTopic/:topicId", async (req, res) => {
  try {
    const topicId = req.params.topicId;

    // Utiliza el método 'destroy' de Sequelize para eliminar el registro
    await Topics.destroy({
      where: {
        id: topicId,
      },
    });

    res.status(200).json({
      message: "Topic deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
