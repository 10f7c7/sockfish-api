const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const config = require('../config/db.config.js');

// initialize database connection
const db = {};
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// load models
// TODO: add model and corresponding db table for user attributes
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
