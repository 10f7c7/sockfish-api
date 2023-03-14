require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET,
    database:process.env.MYSQL_DATABASE,
    username:process.env.MYSQL_USERNAME,
    password:process.env.MYSQL_PASSWORD,
    host:process.env.MYSQL_URL
}