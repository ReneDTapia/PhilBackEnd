const db = require("../models/index.js");
const express = require("express");
const { Pictures } = require("../models");

const router = express.Router();

router.get("/GetPictures/:id/:date", async (req, res) => {
    try {
      // Accede al parámetro 'id' a través de 'req.params.id'
      const id = req.params.id;
      const date = req.params.date;
      // Asegúrate de escapar el 'id' para evitar inyecciones de SQL
      const sql = `SELECT url, id FROM "Pictures" WHERE "user"=${db.sequelize.escape(id)} AND "Date"=${db.sequelize.escape(date)}`;
  
      const pictures = await db.query(sql, db.Sequelize.QueryTypes.SELECT);
  
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
      const id = req.params.id;
      const year = req.params.year;
      const month = req.params.month;

      // Crear la fecha de inicio y fin del mes
      const startDate = `${year}-${month}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Último día del mes

      // Actualizar la consulta SQL para buscar por rango de fechas y retornar también la fecha
      const sql = `SELECT url, id, "Date" FROM "Pictures" WHERE "user"=${db.sequelize.escape(id)} AND "Date" BETWEEN ${db.sequelize.escape(startDate)} AND ${db.sequelize.escape(endDate)}`;

      const pictures = await db.query(sql, db.Sequelize.QueryTypes.SELECT);

      if (pictures.length > 0) {
        res.json(pictures);
      } else {
        res.status(404).json({ error: "No pictures found" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

  
  
  module.exports = router;
