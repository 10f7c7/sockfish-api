const Sequelize = require('sequelize');
require('dotenv').config();

// initialize database connection
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
'users',
'userAuth',
];
models.forEach(function(model) {
module.exports[model] = sequelize.import(__dirname + '/' + model);
});



// export connection
module.exports.sequelize = sequelize;
