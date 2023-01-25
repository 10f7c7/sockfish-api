const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
    // console.log("req:", req, "res:", res, "nex:", next);
    let token = req.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (req.params.userId != decoded.id)  {
        return res.status(401).send({
            message: "Wrong User!"
          });
      }
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      next();
    });
};

justReturn = (req, res, next) => {
    console.log("userId", req.userId);
    next();
    return;
}



const authJwt = {
    verifyToken: verifyToken,
    justReturn: justReturn
};
module.exports = authJwt;
