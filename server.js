require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('./models/index');
const bcrypt = require('bcryptjs');
const session = require('express-session');

async function createApp() {
    const AdminJS = (await import('adminjs')).default;
    const AdminJSExpress = (await import('@adminjs/express')).default;
    const AdminJSSequelize = (await import('@adminjs/sequelize')).default;

    const app = express();

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        // Puedes agregar más opciones de configuración aquí si es necesario
    }));

    // Configuración de AdminJS
    AdminJS.registerAdapter(AdminJSSequelize);
    const adminJs = new AdminJS({
        databases: [db.sequelize],
        rootPath: '/admin',
    });

    // Configuración del enrutador AdminJS con autenticación básica
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        authenticate: async (email, password) => {
            let user = await db.User.findOne({ where: { email: email } });

            if (!user) {
                user = await db.User.findOne({ where: { username: email } });
            }

            if (user) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (isPasswordValid) {
                    return { email: user.email, id: user.id }; // Retorna un objeto de usuario si la autenticación es exitosa
                }
            }

            return false; // Retorna false si la autenticación falla
        },
        cookieName: 'adminjs', // Puedes personalizar el nombre de la cookie si lo deseas
        cookiePassword: process.env.ADMIN_COOKIE_SECRET,
    });

    // Rutas de la aplicación
    const authRoutes = require("./routes/auth");
    const formRoutes = require("./routes/form");
    const topicRoutes = require("./routes/topics");
    const messageRoutes = require("./routes/message");
    const contentRoutes = require("./routes/contents");
    const photosRoutes = require("./routes/photos");
    const sectionRoutes = require("./routes/sections");
    const analRoutes = require("./routes/analytics");

    // Middleware
    app.use(adminJs.options.rootPath, adminRouter);
    app.use(bodyParser.json());
    app.use(cors());

    app.use("/api/auth", authRoutes);
    app.use("/api/auth", formRoutes);
    app.use("/api/auth", topicRoutes);
    app.use("/api/auth", messageRoutes);
    app.use("/api/auth", contentRoutes);
    app.use("/api/auth", photosRoutes);
    app.use("/api/auth", sectionRoutes);
    app.use("/api/auth", analRoutes);

    // Test endpoint
    app.get("/test", (req, res) => {
        res.json({ message: "Test successful" });
    });

    return app;
}

module.exports = createApp;
