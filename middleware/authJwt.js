const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (req.baseUrl == '/api/v1/crisis') {
            req.userId = decoded.id;
            next();
            return;
        }
        if (err) {
            if (err.name == "TokenExpiredError") {
                return res.status(401).send({
                    message: "Token Expired!"
                });
            }
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        if (req.params.userId != decoded.id && req.body.userId != decoded.id) {
            return res.status(401).send({
                message: "Wrong User!"
            });
        }
        req.userId = decoded.id;
        next();
        return;
    });
};

const authJwt = {
    verifyToken: verifyToken
};
module.exports = authJwt;
