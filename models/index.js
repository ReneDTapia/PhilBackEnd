const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://phill:ToRiLIbstrEP@ls-81c839ab7c10ee3c93aa4716af17fd2ba9f1b589.c5tfitxvdzwb.us-east-1.rds.amazonaws.com:5432/phill",
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

// Definir modelos aquí
db.Conversation = require("./conversation")(sequelize, Sequelize.DataTypes);
db.Message = require("./messageModel")(sequelize, Sequelize.DataTypes);

// Tus modelos existentes
db.Admin = require("./admin")(sequelize, Sequelize.DataTypes);
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Contents = require("./contents")(sequelize, Sequelize.DataTypes);
db.Topics = require("./topics")(sequelize, Sequelize.DataTypes);
db.Sections = require("./sections")(sequelize, Sequelize.DataTypes);
db.UserTopics = require("./userTopics")(sequelize, Sequelize.DataTypes);
// Nuevos modelos
db.Categories = require("./categories")(sequelize, Sequelize.DataTypes);
db.Doctors = require("./doctors")(sequelize, Sequelize.DataTypes);
// Cuestionario
db.Cuestionario = require("./cuestionario")(sequelize, Sequelize.DataTypes);
const UsersCuestionarioModel = require("./users_cuestionario");
db.Users_Cuestionario = UsersCuestionarioModel(sequelize, Sequelize.DataTypes);
// db.Users_Cuestionario = require("./users_conversation")(sequelize, Sequelize.DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Configurar relaciones entre modelos
db.Conversation.hasMany(db.Message, { foreignKey: "conversationId" });
db.Message.belongsTo(db.Conversation, { foreignKey: "conversationId" });
db.User = require("./user")(sequelize, Sequelize.DataTypes);

db.Conversation.belongsTo(db.User, { foreignKey: "userId" });
db.User.hasMany(db.Conversation, { foreignKey: "userId" });

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

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
