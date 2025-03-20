const { Sequelize } = require("sequelize");

// Importing the database connection with SSH tunnel
const { createTunnel } = require("../config/database");

let db = {};

const setupModels = (sequelize) => {
  // Define models here
  db.Conversation = require("./conversation")(sequelize, Sequelize.DataTypes);
  db.Message = require("./messageModel")(sequelize, Sequelize.DataTypes);

  // Your existing models
  db.Admin = require("./admin")(sequelize, Sequelize.DataTypes);
  db.User = require("./user")(sequelize, Sequelize.DataTypes);
  db.Contents = require("./contents")(sequelize, Sequelize.DataTypes);
  db.Topics = require("./topics")(sequelize, Sequelize.DataTypes);
  db.Sections = require("./sections")(sequelize, Sequelize.DataTypes);
  db.UserTopics = require("./userTopics")(sequelize, Sequelize.DataTypes);
  // Cuestionario
  db.Cuestionario = require("./cuestionario")(sequelize, Sequelize.DataTypes);
  const UsersCuestionarioModel = require("./users_cuestionario");
  db.Users_Cuestionario = UsersCuestionarioModel(sequelize, Sequelize.DataTypes);

  // Set up query method
  db.query = async (sql, queryType) => {
    try {
      if (queryType) {
        const result = await sequelize.query(sql, { type: queryType });
        return result;
      } else {
        throw new Error("Query type not specified");
      }
    } catch (err) {
      throw err;
    }
  };

  // Configure relationships between models
  db.Conversation.hasMany(db.Message, { foreignKey: "conversationId" });
  db.Message.belongsTo(db.Conversation, { foreignKey: "conversationId" });

  db.Conversation.belongsTo(db.User, { foreignKey: "userId" });
  db.User.hasMany(db.Conversation, { foreignKey: "userId" });

  // Set up relations
  db.Cuestionario.hasMany(db.Users_Cuestionario, {
    foreignKey: "Cuestionario_id",
  });
  db.Users_Cuestionario.belongsTo(db.Cuestionario, {
    foreignKey: "Cuestionario_id",
  });

  // Configure associations
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  return db;
};

// Initialize the database connection with SSH tunnel
const initializeDb = async () => {
  try {
    const { sequelize, server } = await createTunnel();
    const initializedDb = setupModels(sequelize);
    initializedDb.server = server; // Store the SSH server to close it later if needed
    
    return initializedDb;
  } catch (error) {
    console.error('Failed to initialize database with SSH tunnel:', error);
    // Fallback to direct connection if SSH fails
    console.log('Attempting direct database connection...');
    
    const sequelize = new Sequelize(
      "postgres://phill:ToRiLIbstrEP@ls-81c839ab7c10ee3c93aa4716af17fd2ba9f1b589.c5tfitxvdzwb.us-east-1.rds.amazonaws.com:5432/phill",
      {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    );
    
    return setupModels(sequelize);
  }
};

// Export a promise that will be resolved with the database instance
module.exports = db;

// Initialize db as a dynamic import
(async () => {
  try {
    const initializedDb = await initializeDb();
    Object.assign(db, initializedDb);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();
