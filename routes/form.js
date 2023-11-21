const express = require("express");
const router = express.Router();
const { Cuestionario, Users_Cuestionario, sequelize } = require("../models"); // Importa los modelos

router.get("/getForm", async (req, res) => {
  try {
    const cuestionarios = await Cuestionario.findAll();

    if (cuestionarios.length > 0) {
      res.json(cuestionarios);
    } else {
      res.status(404).json({ error: "No cuestionarios were found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/postForm", async (req, res) => {
  try {
    // Recoger las respuestas y el ID del usuario del cuerpo de la solicitud
    const { Users_id, Cuestionario_id, checked } = req.body;

<<<<<<< Updated upstream
    // Crear la consulta SQL para insertar las respuestas
    let sql = `INSERT INTO "Users_Cuestionario" ("Users_id", "Cuestionario_id", "checked") VALUES (${Users_id}, ${Cuestionario_id}, ${checked})`;

    const text = await db.query(sql, db.Sequelize.QueryTypes.INSERT);

    if (text.length > 0) {
      res.json(text);
=======
    const userForm = await Users_Cuestionario.findAll({
      attributes: ["Cuestionario.texto", "Percentage", "Users_Cuestionario_id"],
      include: [
        {
          model: Cuestionario,
          attributes: [],
          where: {
            id: sequelize.col("Users_Cuestionario.Cuestionario_id"),
          },
        },
      ],
      where: {
        Users_id: Users_id,
      },
    });

    if (userForm.length > 0) {
      res.json(userForm);
>>>>>>> Stashed changes
    } else {
      res.status(404).json({ error: "No user forms were found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
<<<<<<< Updated upstream
=======
});

router.post("/postUserForm", async (req, res) => {
  try {
    const answers = req.body;

    for (let answer of answers) {
      const { Users_id, Cuestionario_id, Percentage } = answer;

      await Users_Cuestionario.create({
        Users_id: Users_id,
        Cuestionario_id: Cuestionario_id,
        Percentage: Percentage,
      });
    }

    res.status(201).json({ result: "Respuestas insertadas con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
>>>>>>> Stashed changes
});

router.put("/updateUserForm/:Users_id", async (req, res) => {
  try {
    const { Users_id } = req.params;
    const answers = req.body;
    for (let answer of answers) {
      const { Cuestionario_id, Percentage } = answer;
      const escapedUsers_id = sequelize.escape(Users_id);
      const escapedCuestionario_id = sequelize.escape(Cuestionario_id);
      const escapedPercentage = sequelize.escape(Percentage);
      let sql = `UPDATE public."Users_Cuestionario" SET "Cuestionario_id" = ${escapedCuestionario_id}, "Percentage" = ${escapedPercentage} WHERE "Users_id" = ${escapedUsers_id};`;
      const result = await sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE });
    }
    res.status(200).json({ result: "Respuestas actualizadas con éxito" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
<<<<<<< Updated upstream
=======

// router.delete("/deleteUserForm/:user_id", async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const escapedUsers_id = db.sequelize.escape(user_id);

//     let sql = `DELETE FROM public."Users_Cuestionario" WHERE "Users_id" = ${escapedUsers_id};`;

//     const result = await db.query(sql, db.Sequelize.QueryTypes.DELETE);

//     if (result === 0) {
//       res.status(404).json({ result: "No se encontraron registros para eliminar" });
//     } else {
//       res.status(200).json({ result: "Registros eliminados con éxito" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


/*
método que elimine todos los registros de un usuario dependiendo de su id borrando solo sus registros, ejecutando antes del post de las nuevas pregutnas
wait el post y luego de que borre (confirmar que se elimino)
*/
>>>>>>> Stashed changes
