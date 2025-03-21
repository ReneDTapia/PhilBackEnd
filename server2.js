const pg = require("pg");
const { config } = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//config();

const app = express();

// Ajusta el límite de tamaño de carga
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//const pool = new pg.pool({
ConnectionString: process.env.DATABASE_URL;
//})

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
app.use(bodyParser.json());
app.use(cors());
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

module.exports = app;
