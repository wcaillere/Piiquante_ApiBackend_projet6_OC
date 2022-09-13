//import package, controller, and creates the router
const express = require('express');
const userCtrl = require('../controllers/user');
const rateLimit = require('../middleware/rateLimit');
const router = express.Router();

//routes
router.post('/signup', rateLimit.signupLimiter, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;