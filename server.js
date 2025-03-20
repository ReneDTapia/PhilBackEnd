require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
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
    
    console.log('Database connection established, starting server...');
    
    const app = express();

    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
      })
    );

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

    // Add a database connection test endpoint
    app.get("/api/test-db-connection", async (req, res) => {
      try {
        await db.sequelize.authenticate();
        const [results] = await db.sequelize.query('SELECT NOW() as current_time');
        
        res.json({ 
          success: true, 
          message: "Database connection established successfully through SSH tunnel",
          dbInfo: {
            database: db.sequelize.config.database,
            host: db.sequelize.config.host,
            port: db.sequelize.config.port,
            username: db.sequelize.config.username,
            dialect: db.sequelize.getDialect()
          },
          serverTime: results[0].current_time
        });
      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: "Database connection failed", 
          error: error.message 
        });
      }
    });

    const PORT = process.env.PORT || 3004;
    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`Test endpoint: http://localhost:${PORT}/test`);
      console.log(`Database connection test: http://localhost:${PORT}/api/test-db-connection`);
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
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
