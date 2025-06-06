// routes/auth.js
const db = require("../models/index.js");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { User } = require("../models");
const { authenticateToken } = require("./jwt");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "304931507008-gu9213ibc152hbqk732m4nlb2rm3fset.apps.googleusercontent.com"; // Reemplaza con tu Google Client ID
const client = new OAuth2Client(CLIENT_ID);
const router = express.Router();

// google
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({
      where: { email: payload.email },
    });
    let user;
    if (existingUser) {
      // Usuario existente, puedes actualizar los datos si es necesario
      user = existingUser;
    } else {
      // Usuario nuevo, crea uno
      user = await User.create({
        email: payload.email,
        username: payload.name, // O generar un nombre de usuario único
        password: bcrypt.hashSync(payload.sub, 10), // Considerar si es necesario
        // otros campos si son necesarios
      });
    }

    // Generar y enviar token JWT
    const jwtToken = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });
    res.json({ token: jwtToken, userID: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    // Comprobación de campos obligatorios
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email, username, and password" });
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
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });
    const userID = user.id;

    return res.json({ token, userID });
    // Respuesta exitosa
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ruta para borrar un usuario por su ID
router.delete("/deleteUser/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await user.destroy();
    return res.status(204).end(); // No Content, el usuario fue borrado con éxito
  } catch (error) {
    console.error("Error al borrar el usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
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
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al comparar contraseñas" });
        }

        if (isMatch) {
          // Si las contraseñas coinciden, proceder con la lógica de autenticación
          const token = jwt.sign({ userId: user.id }, "your_secret_key", {
            expiresIn: "1h",
          });
          const userID = user.id;
          return res.json({ token, userID });
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

router.get("/GetUsersInfo/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: ["username", "email"],
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/PutUsername/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { newUsername } = req.body;

    // Verificar si el nuevo nombre de usuario ya existe
    const existingUsernameUser = await User.findOne({
      where: { username: newUsername },
    });
    if (existingUsernameUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = await User.findByPk(id);

    if (user) {
      user.username = newUsername;
      await user.save();
      res.status(200).json({ message: "Username updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/postUser", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email, username, and password" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must have at least 8 characters" });
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

// Obtener estadísticas de usuario (temas completados por categoría)
router.get("/user-stats/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener todas las categorías
    const allCategories = await db.Categories.findAll();

    // Obtener los topics completados por el usuario
    const userTopics = await db.UserTopics.findAll({
      where: { 
        user: userId,
        done: true 
      },
      include: [
        {
          model: db.Topics,
          as: 'topicDetail',
          include: [
            {
              model: db.Contents,
              as: 'contentDetail',
              include: [
                {
                  model: db.Categories,
                  as: 'category'
                }
              ]
            }
          ]
        }
      ]
    });

    // Contar total completados
    const totalTopicsCompleted = userTopics.length;

    // Mapa de conteo por categoría
    const categoryCounts = new Map();

    userTopics.forEach(userTopic => {
      const category = userTopic.topicDetail?.contentDetail?.category;
      if (category) {
        const id = category.id;
        categoryCounts.set(id, (categoryCounts.get(id) || 0) + 1);
      }
    });

    // Armar categoriesStats incluyendo todas las categorías
    const categoriesStats = allCategories.map(cat => ({
      category: cat,
      topicsCompleted: categoryCounts.get(cat.id) || 0
    }));

    const completedCategories = categoriesStats
      .filter(stat => stat.topicsCompleted > 0)
      .map(stat => stat.category);

    const userStats = {
      userId: parseInt(userId),
      username: user.username,
      totalTopicsCompleted,
      categoriesStats,
      completedCategories
    };

    res.json(userStats);
  } catch (err) {
    console.error("Error al obtener estadísticas del usuario:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
