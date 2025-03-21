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
    resources: [
      { resource: db.User, options: { navigation: { name: 'Usuarios' } } },
      { resource: db.Admin, options: { navigation: { name: 'Administradores' } } },
      { resource: db.Contents, options: { navigation: { name: 'Contenidos' } } },
      { resource: db.Topics, options: { navigation: { name: 'Temas' } } },
      { resource: db.Sections, options: { navigation: { name: 'Secciones' } } },
      { resource: db.UserTopics, options: { navigation: { name: 'Temas de Usuarios' } } },
      { resource: db.Cuestionario, options: { navigation: { name: 'Cuestionarios' } } },
      { resource: db.Users_Cuestionario, options: { navigation: { name: 'Respuestas de Cuestionarios' } } },
      { resource: db.Conversation, options: { navigation: { name: 'Conversaciones' } } },
      { resource: db.Message, options: { navigation: { name: 'Mensajes' } } },
      { resource: db.Categories, options: { navigation: { name: 'Categorías' } } },
      { resource: db.Doctors, options: { navigation: { name: 'Doctores' } } },
      { resource: db.DoctorsMode, options: { navigation: { name: 'Modos de Doctores' } } }
    ],
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

  // Corrección de la configuración de la conexión
  //const pool = new pg.pool({
  //  connectionString: process.env.DATABASE_URL
  //})

  // Rutas para todos los modelos
  const authRoutes = require("./routes/auth");
  const formRoutes = require("./routes/form");
  const topicRoutes = require("./routes/topics");
  const messageRoutes = require("./routes/message");
  const contentRoutes = require("./routes/contents");
  const sectionRoutes = require("./routes/sections");
  const analyticsRoutes = require("./routes/analytics");
  const categoriesRoutes = require("./routes/categories");
  const conversationRoutes = require("./routes/conversation");
  const cuestionarioRoutes = require("./routes/cuestionario");
  const doctorsRoutes = require("./routes/doctors");
  const doctorCategoriesRoutes = require("./routes/doctorCategories");
  const doctorReviewsRoutes = require("./routes/doctorReviews");
  const userTopicsRoutes = require("./routes/userTopics");
  const doctorsModeRoutes = require("./routes/doctorsMode");

  // Middleware

  // AdminJS
  app.use(adminJs.options.rootPath, adminRouter);

  app.use(bodyParser.json());
  app.use(cors());
  
  // Configuración de rutas API
  app.use("/api/auth", authRoutes);
  app.use("/api/auth", formRoutes);
  app.use("/api/auth", topicRoutes);
  app.use("/api/auth", messageRoutes);
  app.use("/api/auth", contentRoutes);
  app.use("/api/auth", sectionRoutes);
  app.use("/api/auth", analyticsRoutes);
  app.use("/api/auth", categoriesRoutes);
  app.use("/api/auth", conversationRoutes);
  app.use("/api/auth", cuestionarioRoutes);
  app.use("/api/auth", doctorsRoutes);
  app.use("/api/auth", doctorCategoriesRoutes);
  app.use("/api/auth", doctorReviewsRoutes);
  app.use("/api/auth", userTopicsRoutes);
  app.use("/api/auth", doctorsModeRoutes);

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
