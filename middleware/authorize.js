const jwt = require("jsonwebtoken");
const environment = require('../config/environment');
const config =environment.config();

module.exports = (req, res, next) => {
  try {
     const token = req.headers.authorization.split(" ")[1];
    if(token){
    const decodedToken = jwt.verify(token, config.jwt_token);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
    }else{
      res.status(401).json({status:false, message: "You are not authenticated!" });
      next();
    }
  } catch (error) {
    res.status(401)
       .json({
         status:false, 
         message: "You are not authenticated!"
       });
   }
};
