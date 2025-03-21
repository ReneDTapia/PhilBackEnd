const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { DoctorCategories, Doctors, Categories } = require("../models");

// Obtener todas las relaciones entre doctores y categorías
router.get("/", authenticateToken, async (req, res) => {
  try {
    const doctorCategories = await DoctorCategories.findAll({
      include: [
        {
          model: Doctors,
          as: "doctor"
        },
        {
          model: Categories,
          as: "category"
        }
      ]
    });

    res.json(doctorCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener categorías por doctor
router.get("/doctor/:doctorId", authenticateToken, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctorWithCategories = await Doctors.findByPk(doctorId, {
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] } // Excluir los atributos de la tabla intermedia
        }
      ]
    });

    if (!doctorWithCategories) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(doctorWithCategories.categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener doctores por categoría
router.get("/category/:categoryId", authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const categoryWithDoctors = await Categories.findByPk(categoryId, {
      include: [
        {
          model: Doctors,
          as: "doctors",
          through: { attributes: [] } // Excluir los atributos de la tabla intermedia
        }
      ]
    });

    if (!categoryWithDoctors) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(categoryWithDoctors.doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Asignar una categoría a un doctor
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { doctor_id, category_id } = req.body;

    if (!doctor_id || !category_id) {
      return res.status(400).json({ error: "Doctor ID and Category ID are required" });
    }

    // Verificar si el doctor existe
    const doctor = await Doctors.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Verificar si la categoría existe
    const category = await Categories.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Verificar si la relación ya existe
    const existingRelation = await DoctorCategories.findOne({
      where: {
        doctor_id,
        category_id
      }
    });

    if (existingRelation) {
      return res.status(409).json({ error: "This doctor is already assigned to this category" });
    }

    // Crear la nueva relación
    const newDoctorCategory = await DoctorCategories.create({
      doctor_id,
      category_id,
      created_at: new Date()
    });

    res.status(201).json(newDoctorCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una relación entre doctor y categoría
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const doctorCategory = await DoctorCategories.findByPk(id);

    if (!doctorCategory) {
      return res.status(404).json({ error: "Relation not found" });
    }

    await doctorCategory.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 