const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { Categories } = require("../models");

// Obtener todas las categorías
router.get("/getCategories", authenticateToken, async (req, res) => {
  try {
    const categories = await Categories.findAll({
      order: [["id", "ASC"]],
    });

    if (categories.length > 0) {
      res.json(categories);
    } else {
      res.status(404).json({ error: "No categories found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una categoría por su ID
router.get("/getCategory/:id", authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Categories.findByPk(categoryId);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva categoría
router.post("/createCategory", authenticateToken, async (req, res) => {
  try {
    const { name, emoji, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newCategory = await Categories.create({
      name,
      emoji,
      color
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una categoría
router.put("/updateCategory/:id", authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, emoji, color } = req.body;
    
    const category = await Categories.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    await category.update({
      name: name || category.name,
      emoji: emoji || category.emoji,
      color: color || category.color
    });
    
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una categoría
router.delete("/deleteCategory/:id", authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Categories.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    await category.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 