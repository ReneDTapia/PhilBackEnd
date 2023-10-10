const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/auth');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: "Test successful" });
});

module.exports = app;  // Exporta la aplicación

