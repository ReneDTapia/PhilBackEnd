// models/user.js

const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    User.beforeCreate((user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    });

    return User;
};

