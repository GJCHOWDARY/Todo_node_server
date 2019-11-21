const jwt = require('jsonwebtoken');
const environment = require('../config/environment');
const config =environment.config();

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  // console.log(authHeader);
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.jwt_token);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  // console.log(decodedToken)
  req.userId = decodedToken.jwtData.userId;
  req.role = decodedToken.jwtData.role;
  req.organizationId = decodedToken.jwtData.organizationId;
  req.isAuth = true;
  next();
};
