const db = require("../models/index.js");
const express = require("express");
const { Pictures } = require("../models");
const { Sequelize, Op } = require('sequelize');

const router = express.Router();

  router.get("/GetPictures/:id/:date", async (req, res) => {
    try {
      const { id, date } = req.params;
      
      // Utiliza el método 'findAll' de Sequelize
      const pictures = await Pictures.findAll({
        where: {
          user: id,
          Date: date
        }
      });

      if (pictures.length > 0) {
        res.json(pictures);
      } else {
        res.status(404).json({ error: "No pictures found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  router.post('/AddPicture', async (req, res) => {
    try {
      // Extraer los datos del cuerpo de la solicitud
      const { url, user, date } = req.body;
  
      // Validar los datos, asegurándose de que ninguno esté vacío
      if (!url || !user || !date) {
        return res.status(400).json({ error: "Los campos 'url', 'user', y 'date' son requeridos" });
      }
  
      // Crear un nuevo registro en la base de datos
      const newPicture = await Pictures.create({ url, user, Date: date });
  
      // Si todo sale bien, enviamos una respuesta con el registro creado
      res.status(201).json({ message: 'Picture added successfully', picture: newPicture });
  
    } catch (err) {
      // Si hay un error, lo atrapamos y enviamos una respuesta adecuada
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/GetPicturesMonth/:id/:year/:month", async (req, res) => {
    try {
      const { id, year, month } = req.params;
  
      // Crear la fecha de inicio y fin del mes
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
  
      // Buscar las imágenes en el rango de fechas usando Sequelize
      const pictures = await Pictures.findAll({
        where: {
          user: id,
          Date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: ['url', 'id', 'Date']
      });
  
      // Conversión explícita a Date y formateo
      const formattedPictures = pictures.map(picture => {
        const dateObj = new Date(picture.Date); // Conversión a objeto Date
        return {
          ...picture.get({ plain: true }),
          Date: dateObj.toISOString().split('T')[0] // Formateo a YYYY-MM-DD
        };
      });
  
      if (formattedPictures.length > 0) {
        res.json(formattedPictures);
      } else {
        res.status(404).json({ error: "No pictures found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
  
  module.exports = router;