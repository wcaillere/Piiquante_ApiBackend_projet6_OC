
const rateLimit = require('express-rate-limit');

exports.signupLimiter = rateLimit({
    windowMs: 30*60*1000,
    max: 5,
    message: "Trop de tentative de création de compte depuis cet IP¨, veuillez réessayer plus tard",
    standardHeaders: true,
    legacyHeaders: false,
  })
  