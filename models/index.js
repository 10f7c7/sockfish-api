const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const path = require('path');

// initialize database connection
const db = {};
var sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_URL,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// load models
var models = [
    'users.model',
    'crisis.model',
    'hallpasslog.model',
    'counselors.model',
    'appointments.model'
];
models.forEach(function (file) {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
