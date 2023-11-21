const db = require("../models/index.js");
const express = require("express");
const { Sequelize, Op } = require("sequelize");
const { Sections } = require("../models");

const router = express.Router();

router.get("/getSections/:id", async (req, res) => {
  try {
    const topicId = req.params.id;

    // Utiliza el método 'findAll' de Sequelize con la opción 'where'
    const sections = await Sections.findAll({
      attributes: ["id", "text", "video", "image"],
      where: {
        topic: topicId,
      },
      order: [["id", "ASC"]],
    });

    if (sections.length > 0) {
      res.json(sections);
    } else {
      res
        .status(404)
        .json({ error: "No sections were found for the given topic id" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/postSection", async (req, res) => {
  try {
    const { text, video, image, topic } = req.body;

    // Utiliza el método 'create' de Sequelize para insertar un nuevo registro
    const newSection = await Sections.create({
      text: text,
      video: video,
      image: image,
      topic: topic,
    });

    res.status(201).json({ messageId: newSection.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateSection", async (req, res) => {
  try {
    const { id, text, video, image, topic } = req.body;

    // Utiliza el método 'update' de Sequelize para realizar la actualización
    const result = await Sections.update(
      {
        text: text,
        video: video,
        image: image,
        topic: topic,
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

router.delete("/deleteSection/:sectionId", async (req, res) => {
  try {
    const sectionId = req.params.sectionId;

    // Utiliza el método 'destroy' de Sequelize para eliminar el registro
    await Sections.destroy({
      where: {
        id: sectionId,
      },
    });

    res.status(200).json({
      message: "Section deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
