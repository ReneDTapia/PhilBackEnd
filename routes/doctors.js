const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { Doctors } = require("../models");

// Obtener todos los doctores
router.get("/getDoctors", authenticateToken, async (req, res) => {
  try {
    const doctors = await Doctors.findAll({
      order: [["id", "ASC"]],
    });

    if (doctors.length > 0) {
      res.json(doctors);
    } else {
      res.status(404).json({ error: "No doctors found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un doctor por su ID
router.get("/getDoctor/:id", authenticateToken, async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctors.findByPk(doctorId);

    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: "Doctor not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo doctor
router.post("/createDoctor", authenticateToken, async (req, res) => {
  try {
    const { name, address, email, availability, description } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newDoctor = await Doctors.create({
      name,
      address,
      email,
      availability,
      description,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un doctor
router.put("/updateDoctor/:id", authenticateToken, async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { name, address, email, availability, description } = req.body;
    
    const doctor = await Doctors.findByPk(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    
    await doctor.update({
      name: name || doctor.name,
      address: address || doctor.address,
      email: email || doctor.email,
      availability: availability || doctor.availability,
      description: description || doctor.description,
      updated_at: new Date()
    });
    
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un doctor
router.delete("/deleteDoctor/:id", authenticateToken, async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctors.findByPk(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    
    await doctor.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 