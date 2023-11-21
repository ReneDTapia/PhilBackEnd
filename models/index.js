const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://phil:Ecmz4pjtiJtWHvQ4miUwS5hB6digwKI8@dpg-cknk4cujmi5c739llg30-a.oregon-postgres.render.com/phil",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Disable certificate verification
      },
    },
  }
);

// Link interno: postgres://phil:Ecmz4pjtiJtWHvQ4miUwS5hB6digwKI8@dpg-cknk4cujmi5c739llg30-a/phil
// Link externo: postgres://phil:Ecmz4pjtiJtWHvQ4miUwS5hB6digwKI8@dpg-cknk4cujmi5c739llg30-a.oregon-postgres.render.com/phil

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

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

<<<<<<< Updated upstream



db.User = require('./user')(sequelize, Sequelize.DataTypes);
=======
// Definir modelos aquí
db.Conversation = require("./conversation")(sequelize, Sequelize.DataTypes);
db.Message = require("./messageModel")(sequelize, Sequelize.DataTypes);
db.Users_Conversation = require("./users_conversation")(
  sequelize,
  Sequelize.DataTypes
);

// Tus modelos existentes
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Pictures = require("./picture")(sequelize, Sequelize.DataTypes);

// Sequelize y sequelize (instancia)
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Configurar relaciones entre modelos
db.Conversation.hasMany(db.Message, { foreignKey: "conversationId" });
db.Message.belongsTo(db.Conversation, { foreignKey: "conversationId" });

db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Pictures = require("./picture")(sequelize, Sequelize.DataTypes);

// Cuestionario
db.Cuestionario = require("./cuestionario")(sequelize, Sequelize.DataTypes);
const UsersCuestionarioModel = require("./users_cuestionario");
db.Users_Cuestionario = UsersCuestionarioModel(sequelize, Sequelize.DataTypes);

db.User.belongsToMany(db.Conversation, {
  through: db.Users_Conversation,
  foreignKey: "Users_id",
  otherKey: "Conversation_conversationId",
});

db.Conversation.belongsToMany(db.User, {
  through: db.Users_Conversation,
  foreignKey: "Conversation_conversationId",
  otherKey: "Users_id",
});

// Configura las relaciones
db.Cuestionario.hasMany(db.Users_Cuestionario, {
  foreignKey: "Cuestionario_id",
});
db.Users_Cuestionario.belongsTo(db.Cuestionario, {
  foreignKey: "Cuestionario_id",
});

// Configura las asociaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
>>>>>>> Stashed changes

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
