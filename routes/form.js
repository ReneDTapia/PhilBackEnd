const db = require("../models/index.js");
const express = require("express");

const router = express.Router();

router.get("/getForm", async (req, res) => {
  try {
    sql = `SELECT * FROM "Cuestionario"`;
    const text = await db.query(sql, db.Sequelize.QueryTypes.SELECT);

    if (text.length > 0) {
      res.json(text);
    } else {
      res.status(404).json({ error: "No text was found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); //chocas vuelve a casa porfavor

router.post("/postForm", async (req, res) => {
  try {
    // Recoger las respuestas y el ID del usuario del cuerpo de la solicitud
    const { Users_id, Cuestionario_id, checked } = req.body;

    // Crear la consulta SQL para insertar las respuestas
    let sql = `INSERT INTO "Users_Cuestionario" ("Users_id", "Cuestionario_id", "checked") VALUES (${Users_id}, ${Cuestionario_id}, ${checked})`;

    const text = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

    if (text.length > 0) {
      res.json(text);
    } else {
      res.status(404).json({ error: "No text was found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
