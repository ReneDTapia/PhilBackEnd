const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://phil:Ecmz4pjtiJtWHvQ4miUwS5hB6digwKI8@dpg-cknk4cujmi5c739llg30-a.oregon-postgres.render.com/phil', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Disable certificate verification
        }
    }
});

// Link interno: postgres://phil:Ecmz4pjtiJtWHvQ4miUwS5hB6digwKI8@dpg-cknk4cujmi5c739llg30-a/phil
// Link externo: postgres://phil:Ecmz4pjtiJtWHvQ4miUwS5hB6digwKI8@dpg-cknk4cujmi5c739llg30-a.oregon-postgres.render.com/phil



sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};

db.query = async (sql, queryType) => {
    try {
        if (queryType) {
            const result = await sequelize.query(sql, { type: queryType });
            return result;
        } else {
            throw new Error('Query type not specified');
        }
    } catch (err) {
        throw err;
    }
};




db.User = require('./user')(sequelize, Sequelize.DataTypes);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;

