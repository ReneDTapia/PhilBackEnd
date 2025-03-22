const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { DoctorsMode, Doctors } = require("../models");

// Obtener todos los modos de doctores
router.get("/getDoctorsMode", authenticateToken, async (req, res) => {
  try {
    const doctorsModes = await DoctorsMode.findAll({
      include: [
        {
          model: Doctors,
          as: "doctor",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    res.json(doctorsModes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener modos por doctor
router.get("/getDoctorMode/:doctorId", authenticateToken, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await Doctors.findByPk(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctorModes = await DoctorsMode.findAll({
      where: { doctor_id: doctorId }
    });

    res.json(doctorModes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un modo específico
router.get("/getDoctorsMode/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const doctorMode = await DoctorsMode.findByPk(id, {
      include: [
        {
          model: Doctors,
          as: "doctor",
          attributes: ["id", "name", "email"]
        }
      ]
    });

    if (!doctorMode) {
      return res.status(404).json({ error: "Doctor mode not found" });
    }

    res.json(doctorMode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo modo para un doctor
router.post("/addDoctorMode", authenticateToken, async (req, res) => {
  try {
    const { doctor_id, mode } = req.body;

    if (!doctor_id || !mode) {
      return res.status(400).json({ error: "Doctor ID and mode are required" });
    }

    // Verificar si el doctor existe
    const doctor = await Doctors.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Crear el nuevo modo
    const newDoctorMode = await DoctorsMode.create({
      doctor_id,
      mode,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json(newDoctorMode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un modo
router.put("/updateDoctorMode", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { mode } = req.body;

    if (!mode) {
      return res.status(400).json({ error: "Mode is required" });
    }

    const doctorMode = await DoctorsMode.findByPk(id);

    if (!doctorMode) {
      return res.status(404).json({ error: "Doctor mode not found" });
    }

    doctorMode.mode = mode;
    doctorMode.updated_at = new Date();
    await doctorMode.save();

    res.json(doctorMode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un modo
router.delete("/deleteDoctorMode/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const doctorMode = await DoctorsMode.findByPk(id);

    if (!doctorMode) {
      return res.status(404).json({ error: "Doctor mode not found" });
    }

    await doctorMode.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 