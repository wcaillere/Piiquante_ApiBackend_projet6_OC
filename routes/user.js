//import package, controller, and creates the router
const express = require('express');
const userCtrl = require('../controllers/user');
const router = express.Router();

//routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;