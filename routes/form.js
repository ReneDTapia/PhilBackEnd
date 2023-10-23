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


router.get("/getUserForm/:Users_id", async (req, res) => {
  try {


    const Users_id = req.params.Users_id;
    
    sql = `SELECT "Cuestionario"."texto", "Users_Cuestionario"."checked"
    FROM "Users_Cuestionario"
    INNER JOIN "Cuestionario" ON "Users_Cuestionario"."Cuestionario_id" = "Cuestionario"."id"
    WHERE "Users_Cuestionario"."Users_id" = ${Users_id};
    `;
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




module.exports = router;
