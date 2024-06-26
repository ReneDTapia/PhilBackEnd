require("dotenv").config();
const pg = require("pg");
const { config } = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models/index");
const bcrypt = require("bcryptjs");
const session = require("express-session");
//config();

(async () => {
  const AdminJS = (await import("adminjs")).default;
  const AdminJSExpress = (await import("@adminjs/express")).default;
  const AdminJSSequelize = (await import("@adminjs/sequelize")).default;

  const app = express();

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      // Puedes agregar más opciones de configuración aquí si es necesario
    })
  );

  // Configuración de AdminJS
  AdminJS.registerAdapter(AdminJSSequelize);
  const adminJs = new AdminJS({
    databases: [db.sequelize],
    rootPath: "/admin",
  });

  // Configuración del enrutador AdminJS con autenticación básica

  // Configuración del enrutador AdminJS con autenticación básica
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (username, password) => {
      let admin = await db.Admin.findOne({ where: { username: username } });

      if (admin && password === admin.password) {
        // Compara directamente las contraseñas como cadenas de texto
        return { username: admin.username, id: admin.id }; // Retorna un objeto de administrador si la autenticación es exitosa
      }

      return false; // Retorna false si la autenticación falla
    },
    cookieName: "adminjs", // Puedes personalizar el nombre de la cookie si lo deseas
    cookiePassword: process.env.ADMIN_COOKIE_SECRET,
  });

  //const pool = new pg.pool({
  ConnectionString: process.env.DATABASE_URL;
  //})

  const authRoutes = require("./routes/auth");
  const formRoutes = require("./routes/form");
  const topicRoutes = require("./routes/topics");
  const messageRoutes = require("./routes/message");
  const contentRoutes = require("./routes/contents");
  const sectionRoutes = require("./routes/sections");

  // Middleware

  // AdminJS
  app.use(adminJs.options.rootPath, adminRouter);

  app.use(bodyParser.json());
  app.use(cors());
  app.use("/api/auth", authRoutes);
  app.use("/api/auth", formRoutes);
  app.use("/api/auth", topicRoutes);
  app.use("/api/auth", messageRoutes);
  app.use("/api/auth", contentRoutes);
  app.use("/api/auth", sectionRoutes);

  // Test endpoint
  app.get("/test", (req, res) => {
    res.json({ message: "Test successful" });
  });

  const PORT = process.env.PORT || 3004;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  module.exports = app; // Exporta la aplicación
})();
