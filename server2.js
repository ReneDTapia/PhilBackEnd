require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models/index");

// Start the server once the database is initialized
(async () => {
  try {
    // Wait for the database to be initialized (this happens in models/index.js)
    // Give it some time to establish the SSH tunnel and database connection
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Make sure db.sequelize is available
    if (!db.sequelize) {
      console.error('Database connection not initialized properly');
      process.exit(1);
    }
    
    console.log('Database connection established, starting server2...');
    
    const app = express();

    // Ajusta el límite de tamaño de carga
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    const authRoutes = require("./routes/auth");
    const formRoutes = require("./routes/form");
    const topicRoutes = require("./routes/topics");
    const messageRoutes = require("./routes/message");
    const contentRoutes = require("./routes/contents");
    const sectionRoutes = require("./routes/sections");

    // Middleware
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

    // Users test endpoint (non-authenticated)
    app.get("/api/users", async (req, res) => {
      try {
        const sql = 'SELECT * FROM "Users"';
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

    const PORT = process.env.PORT || 3005;
    const server = app.listen(PORT, () => {
      console.log(`Server2 started on port ${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/test`);
      console.log(`Users endpoint: http://localhost:${PORT}/api/users`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server and SSH tunnel');
      server.close(() => {
        console.log('HTTP server closed');
        
        // Close SSH tunnel if it exists
        if (db.server && typeof db.server.close === 'function') {
          db.server.close();
          console.log('SSH tunnel closed');
        }
        
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server and SSH tunnel');
      server.close(() => {
        console.log('HTTP server closed');
        
        // Close SSH tunnel if it exists
        if (db.server && typeof db.server.close === 'function') {
          db.server.close();
          console.log('SSH tunnel closed');
        }
        
        process.exit(0);
      });
    });

    module.exports = app; // Exporta la aplicación
  } catch (error) {
    console.error('Failed to start server2:', error);
    process.exit(1);
  }
})();
