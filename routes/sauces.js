const express = require('express');
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/', auth, sauceCtrl.getAllSauces);

router.post('/', auth, sauceCtrl.createOneSauce);

module.exports = router;