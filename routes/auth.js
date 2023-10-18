// routes/auth.js
const db = require("../models/index.js");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { User } = require("../models");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email, username, and password" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const passwordError = passwordValidationError(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const existingEmailUser = await User.findOne({ where: { email } });
    if (existingEmailUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsernameUser = await User.findOne({ where: { username } });
    if (existingUsernameUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    // Intenta encontrar al usuario por correo electrónico
    let user = await User.findOne({ where: { email: loginIdentifier } });

    // Si no se encontró por correo electrónico, intenta por nombre de usuario
    if (!user) {
      user = await User.findOne({ where: { username: loginIdentifier } });
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, "your_secret_key", {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/GetUsers", async (req, res) => {
  try {
    sql = 'SELECT * FROM "Users"';

    const users = await db.query(sql, db.Sequelize.QueryTypes.SELECT);

    if (users.length > 0) {
      res.json(users);
    } else {
      res.status(404).json({ error: "No users found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/iniform", async (req, res) => {
  try {
    const { value } = req.body;

    // Aquí es donde procesarías el valor del formulario. Por ejemplo, podrías
    // guardar el valor en la base de datos, realizar algún cálculo, etc.

    // Por ahora, solo vamos a enviar el valor de vuelta en la respuesta.
    res.json({ value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); //chocas vuelve a casa porfavor

function passwordValidationError(password) {
  const passwordPattern =
    /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-ñÑ]{8,}$/;
  if (!passwordPattern.test(password)) {
    return "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character.";
  }
  return null;
}

module.exports = router;
