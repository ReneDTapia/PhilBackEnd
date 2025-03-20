const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { Cuestionario, Users_Cuestionario } = require("../models");

// Obtener todos los cuestionarios
router.get("/getCuestionarios", authenticateToken, async (req, res) => {
  try {
    const cuestionarios = await Cuestionario.findAll();

    if (cuestionarios.length > 0) {
      res.json(cuestionarios);
    } else {
      res.status(404).json({ error: "No cuestionarios found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un cuestionario por su ID
router.get("/getCuestionario/:id", authenticateToken, async (req, res) => {
  try {
    const cuestionarioId = req.params.id;
    const cuestionario = await Cuestionario.findByPk(cuestionarioId);

    if (cuestionario) {
      res.json(cuestionario);
    } else {
      res.status(404).json({ error: "Cuestionario not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo cuestionario
router.post("/createCuestionario", authenticateToken, async (req, res) => {
  try {
    const { texto, videoURL } = req.body;
    
    if (!texto) {
      return res.status(400).json({ error: "Texto is required" });
    }

    const newCuestionario = await Cuestionario.create({
      texto,
      videoURL
    });

    res.status(201).json(newCuestionario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un cuestionario
router.put("/updateCuestionario/:id", authenticateToken, async (req, res) => {
  try {
    const cuestionarioId = req.params.id;
    const { texto, videoURL } = req.body;
    
    const cuestionario = await Cuestionario.findByPk(cuestionarioId);
    
    if (!cuestionario) {
      return res.status(404).json({ error: "Cuestionario not found" });
    }
    
    await cuestionario.update({
      texto: texto || cuestionario.texto,
      videoURL: videoURL || cuestionario.videoURL
    });
    
    res.json(cuestionario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un cuestionario
router.delete("/deleteCuestionario/:id", authenticateToken, async (req, res) => {
  try {
    const cuestionarioId = req.params.id;
    const cuestionario = await Cuestionario.findByPk(cuestionarioId);
    
    if (!cuestionario) {
      return res.status(404).json({ error: "Cuestionario not found" });
    }
    
    await cuestionario.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener las respuestas de un usuario a los cuestionarios
router.get("/getUserResponses/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const userResponses = await Users_Cuestionario.findAll({
      where: { user_id: userId },
      include: [{ model: Cuestionario }]
    });
    
    if (userResponses.length > 0) {
      res.json(userResponses);
    } else {
      res.status(404).json({ error: "No user responses found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guardar respuesta de usuario a un cuestionario
router.post("/saveUserResponse", authenticateToken, async (req, res) => {
  try {
    const { userId, cuestionarioId, respuesta } = req.body;
    
    if (!userId || !cuestionarioId || !respuesta) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const newResponse = await Users_Cuestionario.create({
      user_id: userId,
      cuestionario_id: cuestionarioId,
      respuesta
    });
    
    res.status(201).json(newResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 