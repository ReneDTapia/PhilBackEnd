const express = require("express");
const router = express.Router();
const db = require("../models/index.js");
const { authenticateToken } = require("./jwt");
const { Doctors, Categories, DoctorReviews, DoctorsMode } = require("../models");
const { Sequelize } = require("sequelize");

// Obtener todos los doctores
router.get("/getDoctors", authenticateToken , async (req, res) => {
  try {
    const doctors = await Doctors.findAll({
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] }
        },
        {
          model: DoctorsMode,
          as: "modes"
        }
      ]
    });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/getAllDoctors", authenticateToken, async (req, res) => {
  try {
    // Obtener doctores con sus categorías, reseñas y modos
    const doctors = await Doctors.findAll({
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] }
        },
        {
          model: DoctorReviews,
          as: "reviews"
        },
        {
          model: DoctorsMode,
          as: "modes"
        }
      ]
    });

   
    const formattedDoctors = doctors.map(doctor => {
      // 1. Procesar categorías para crear specialties
      const categories = doctor.categories.map(category => category.name);

      let specialties = '';
      if (categories.length === 1) {
        specialties = categories[0];
      } else if (categories.length === 2) {
        specialties = categories.join(' & ');
      } else if (categories.length > 2) {
        specialties = categories.slice(0, -1).join(', ') + ', & ' + categories.slice(-1);
      }
      
      // 2. Calcular rating promedio
      let rating = 0;
      if (doctor.reviews && doctor.reviews.length > 0) {
        const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
        rating = parseFloat((totalRating / doctor.reviews.length).toFixed(1));
      }
      
      // 3. Número de reviews
      const reviewCount = doctor.reviews ? doctor.reviews.length : 0;
      
      // 4. Procesar modos de consulta
      const modes = doctor.modes.map(mode => mode.mode);
      
      // 5. Procesar availability
      let availabilityStatus;
      if (doctor.availability === "today") {
        availabilityStatus = "today";
      } else if (doctor.availability === "tomorrow") {
        availabilityStatus = "tomorrow";
      } else {
        // Si es un día específico, formatearlo como specificDay
        availabilityStatus = {
          specificDay: doctor.availability
        };
      }
      
      // Crear objeto doctor en formato para Swift
      return {
        id: doctor.id,
        name: doctor.name,
        specialties: specialties,
        rating: rating,
        reviewCount: reviewCount,
        availability: availabilityStatus,
        modes: modes,
        price: doctor.price ? parseInt(doctor.price) : 0,
        imageURL: doctor.imageURL,
        description: doctor.description
      };
    });

    res.json(formattedDoctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener doctor por ID
router.get("/getDoctor/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await Doctors.findByPk(id, {
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] }
        },
        {
          model: DoctorReviews,
          as: "reviews"
        },
        {
          model: DoctorsMode,
          as: "modes"
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Calcular promedio de reseñas
    let averageRating = 0;
    if (doctor.reviews && doctor.reviews.length > 0) {
      const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / doctor.reviews.length;
    }

    // Construir la respuesta
    const response = {
      ...doctor.toJSON(),
      averageRating
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo doctor
router.post("/createDoctor", authenticateToken, async (req, res) => {
  try {
    const { name, address, email, availability, description, price, imageURL } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Verificar si ya existe un doctor con ese email
    const existingDoctor = await Doctors.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(409).json({ error: "A doctor with that email already exists" });
    }

    // Crear el nuevo doctor
    const newDoctor = await Doctors.create({
      name,
      address,
      email,
      availability,
      description,
      price,
      imageURL,
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
    const id = req.params.id;
    const { name, address, email, availability, description, price, imageURL } = req.body;

    const doctor = await Doctors.findByPk(id);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Verificar si el email actualizado ya está en uso por otro doctor
    if (email && email !== doctor.email) {
      const existingDoctor = await Doctors.findOne({ where: { email } });
      if (existingDoctor) {
        return res.status(409).json({ error: "A doctor with that email already exists" });
      }
    }

    // Actualizar campos
    if (name) doctor.name = name;
    if (address !== undefined) doctor.address = address;
    if (email) doctor.email = email;
    if (availability !== undefined) doctor.availability = availability;
    if (description !== undefined) doctor.description = description;
    if (price !== undefined) doctor.price = price;
    if (imageURL !== undefined) doctor.imageURL = imageURL;
    
    doctor.updated_at = new Date();
    await doctor.save();

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un doctor
router.delete("/deleteDoctor/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await Doctors.findByPk(id);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await doctor.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar doctores por categoría
router.get("/doctorCategory/:categoryId", authenticateToken, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Categories.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const doctors = await Doctors.findAll({
      include: [
        {
          model: Categories,
          as: "categories",
          where: { id: categoryId },
          through: { attributes: [] }
        },
        {
          model: DoctorsMode,
          as: "modes"
        }
      ]
    });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar doctores por nombre, dirección o descripción
router.get("/searchDoctor/:query", authenticateToken, async (req, res) => {
  try {
    const query = req.params.query;
    const doctors = await Doctors.findAll({
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.iLike]: `%${query}%` } },
          { address: { [Sequelize.Op.iLike]: `%${query}%` } },
          { description: { [Sequelize.Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: Categories,
          as: "categories",
          through: { attributes: [] }
        },
        {
          model: DoctorsMode,
          as: "modes"
        }
      ]
    });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;