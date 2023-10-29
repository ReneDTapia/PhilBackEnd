// routes/auth.js
const db = require("../models/index.js");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { User } = require("../models");
const { authenticateToken } = require("./jwt");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
      const { email, username, password, confirmPassword } = req.body;
  
      // Comprobación de campos obligatorios
      if (!email || !username || !password) {
        return res.status(400).json({ error: "Please provide email, username, and password" });
      }
  
      // Validación de formato de correo electrónico
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
  
      // Comprobación de coincidencia de contraseñas
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
      }
  
      // Validación de la contraseña
      const passwordError = passwordValidationError(password);
      if (passwordError) {
        return res.status(400).json({ error: passwordError });
      }
  
      // Comprobación de correo electrónico duplicado
      const existingEmailUser = await User.findOne({ where: { email } });
      if (existingEmailUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      // Comprobación de nombre de usuario duplicado
      const existingUsernameUser = await User.findOne({ where: { username } });
      if (existingUsernameUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
  
      // Generación de hash de contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Creación del nuevo usuario
      const user = await User.create({ email, username, password: hashedPassword });
  
      // Respuesta exitosa
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
    
    if (user) {
      // Cambiamos a una comparación asíncrona para manejar mejor los errores y evitar bloquear el hilo principal
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) {
          return res.status(500).json({ error: "Error al comparar contraseñas" });
        }

        if (isMatch) {
          // Si las contraseñas coinciden, proceder con la lógica de autenticación
          const token = jwt.sign({ userId: user.id }, "your_secret_key", { expiresIn: "1h" });
          return res.json({ token });
        } else {
          // Si las contraseñas no coinciden, enviar un error
          return res.status(401).json({ error: "Invalid credentials" });
        }
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/GetUsers", authenticateToken, async (req, res) => {
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



router.post("/postUser", async (req, res) => {
    try {
      const { email, username, password } = req.body;
  
      if (!email || !username || !password) {
        return res.status(400).json({ error: "Please provide email, username, and password" });
      }
  
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must have at least 8 characters" });
      }
  
      
  
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      
  
      const newUser = await db.User.create({
        email,
        username,
        password,
      });
  
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

function passwordValidationError(password) {
  const passwordPattern =
    /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-ñÑ]{8,}$/;
  if (!passwordPattern.test(password)) {
    return "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character.";
  }
  return null;
}

module.exports = router;
