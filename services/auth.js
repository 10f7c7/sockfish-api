const config = require("../config/auth.config.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const db = require('../models/index.js');


module.exports = {

    /**
     *
     * @param options.auth.username
     * @param options.auth.password
     */
    postSignUp: async (options) => {
        let sql = `INSERT INTO userauth (username,password) VALUES ('${options.auth.username}','${bcrypt.hashSync(options.auth.password, 8)}');`;
        var returned = await db.sequelize.query(sql, {raw: true});
        var returned = returned[0][0];

        var status = 200;

        return {
            status: status,
            data: { message: returned }
        };
    },

    /**
     *
     * @param options.auth.username
     * @param options.auth.password
     */
    postLogIn: async (options) => {
        let sql = `Select * FROM userauth WHERE username = '${options.auth.username}'`;
        var user = await db.sequelize.query(sql, {raw: true});
        console.log(user);
        var user = user[0][0];
        if (!user) {
            return {
                status: 401,
                data: {
                    accessToken: null,
                    message: "Invalid Login!"
                }
            };
        }

        var passwordIsValid = bcrypt.compareSync(
            options.auth.password,
            user.password
        );
        if (!passwordIsValid) {
            return {
                status: 401,
                data: {
                    accessToken: null,
                    message: "Invalid Login!"
                }
            };
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        return {
            status: 200,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                accessToken: token
            }
        }
    }
}
