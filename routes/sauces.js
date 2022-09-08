const express = require('express');
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');
const router = express.Router();

router.get('/', auth, sauceCtrl.getAllSauces);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.post('/', auth, multer, sauceCtrl.createOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifyOneSauce);

module.exports = router;