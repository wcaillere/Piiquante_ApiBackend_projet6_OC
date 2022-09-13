const rateLimit = require('express-rate-limit');

//Limit the access to the signup functionnality if there are more than 5 requests in one hour
exports.signupLimiter = rateLimit({
    windowMs: 60*60*1000,
    max: 5,
    message: "Trop de tentative de création de compte depuis cet IP, veuillez réessayer plus tard",
    standardHeaders: true,
    legacyHeaders: false,
  });

  //Limit the access to the login functionnality if there are more than 5 requests in 10 minutes
exports.loginLimiter = rateLimit({
    windowMs: 10*60*1000,
    max: 5,
    message: "Trop de tentative de connextion, veuillez réessayer plus tard",
    standardHeaders: true,
    legacyHeaders: false,
  });
  