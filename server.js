const pg = require("pg");
const { config } = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//config();

const app = express();

//const pool = new pg.pool({
ConnectionString: process.env.DATABASE_URL;
//})

const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/form");
const topicRoutes = require("./routes/topics");
const messageRoutes = require("./routes/message");
const contentRoutes = require("./routes/contents");

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/auth", formRoutes);
app.use("/api/auth", topicRoutes);
app.use("/api/auth", messageRoutes);
app.use("/api/auth", contentRoutes);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Test successful" });
});

module.exports = app; // Exporta la aplicación
