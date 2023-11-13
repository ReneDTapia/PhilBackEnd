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

    sql = `SELECT "Cuestionario"."texto", "Users_Cuestionario"."Percentage", "Users_Cuestionario"."Users_Cuestionario_id"
    FROM "Users_Cuestionario"
    INNER JOIN "Cuestionario" ON "Users_Cuestionario"."Cuestionario_id" = "Cuestionario"."id"
    WHERE "Users_Cuestionario"."Users_id" = ${Users_id}`;

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

router.post("/postUserForm", async (req, res) => {
  try {
    const answers = req.body;

    for (let answer of answers) {
      const { Users_id, Cuestionario_id, Percentage } = answer;

      const escapedUsers_id = db.sequelize.escape(Users_id);
      const escapedCuestionario_id = db.sequelize.escape(Cuestionario_id);
      const escapedPercentage = db.sequelize.escape(Percentage);

      let sql = `INSERT INTO public."Users_Cuestionario"("Users_id", "Cuestionario_id", "Percentage")
      VALUES (${escapedUsers_id}, ${escapedCuestionario_id},${escapedPercentage});`;

      const result = await db.query(sql, db.Sequelize.QueryTypes.INSERT);
    }

    res.status(201).json({ result: "Respuestas insertadas con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deleteUserForm/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const escapedUsers_id = db.sequelize.escape(user_id);

    let sql = `DELETE FROM public."Users_Cuestionario" WHERE "Users_id" = ${escapedUsers_id};`;

    const result = await db.query(sql, db.Sequelize.QueryTypes.DELETE);

    if (result === 0) {
      res.status(404).json({ result: "No se encontraron registros para eliminar" });
    } else {
      res.status(200).json({ result: "Registros eliminados con éxito" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/updateUserForm/:Users_id", async (req, res) => {
  try {
    const { Users_id } = req.params;
    const answers = req.body;
    for (let answer of answers) {
      const { Cuestionario_id, Percentage } = answer;
      const escapedUsers_id = db.sequelize.escape(Users_id);
      const escapedCuestionario_id = db.sequelize.escape(Cuestionario_id);
      const escapedPercentage = db.sequelize.escape(Percentage);
      let sql = `UPDATE public."Users_Cuestionario" SET "Cuestionario_id" = ${escapedCuestionario_id}, "Percentage" = ${escapedPercentage} WHERE "Users_id" = ${escapedUsers_id};`;
      const result = await db.query(sql, db.Sequelize.QueryTypes.UPDATE);
    }
    res.status(200).json({ result: "Respuestas actualizadas con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*
método que elimine todos los registros de un usuario dependiendo de su id borrando solo sus registros, ejecutando antes del post de las nuevas pregutnas
wait el post y luego de que borre (confirmar que se elimino)
*/

module.exports = router;
