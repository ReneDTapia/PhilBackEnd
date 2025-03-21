const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { DoctorReviews, Doctors, User } = require("../models");
const { Sequelize } = require("sequelize");

// Obtener todas las reseñas
router.get("/", authenticateToken, async (req, res) => {
  try {
    const reviews = await DoctorReviews.findAll({
      include: [
        {
          model: Doctors,
          as: "doctor",
          attributes: ["id", "name", "email"]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"]
        }
      ]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener reseñas por doctor
router.get("/doctor/:doctorId", authenticateToken, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const reviews = await DoctorReviews.findAll({
      where: { doctor_id: doctorId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"]
        }
      ]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener reseñas por usuario
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await DoctorReviews.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Doctors,
          as: "doctor",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener promedio de calificaciones por doctor
router.get("/average/:doctorId", authenticateToken, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const result = await DoctorReviews.findAll({
      where: { doctor_id: doctorId },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalReviews"]
      ]
    });

    if (result && result.length > 0) {
      res.json({
        doctorId,
        averageRating: parseFloat(result[0].dataValues.averageRating) || 0,
        totalReviews: parseInt(result[0].dataValues.totalReviews) || 0
      });
    } else {
      res.json({
        doctorId,
        averageRating: 0,
        totalReviews: 0
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva reseña
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { doctor_id, user_id, rating } = req.body;

    if (!doctor_id || !user_id || rating === undefined) {
      return res.status(400).json({ error: "Doctor ID, User ID, and rating are required" });
    }

    // Validar que el rating esté entre 1 y 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Verificar si el doctor existe
    const doctor = await Doctors.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Verificar si el usuario existe
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verificar si el usuario ya ha calificado a este doctor
    const existingReview = await DoctorReviews.findOne({
      where: {
        doctor_id,
        user_id
      }
    });

    if (existingReview) {
      // Si ya existe una reseña, actualizar en lugar de crear
      existingReview.rating = rating;
      await existingReview.save();
      return res.json(existingReview);
    }

    // Crear la nueva reseña
    const newReview = await DoctorReviews.create({
      doctor_id,
      user_id,
      rating,
      created_at: new Date()
    });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una reseña
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { rating } = req.body;

    if (rating === undefined) {
      return res.status(400).json({ error: "Rating is required" });
    }

    // Validar que el rating esté entre 1 y 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const review = await DoctorReviews.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.rating = rating;
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una reseña
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const review = await DoctorReviews.findByPk(id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await review.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 