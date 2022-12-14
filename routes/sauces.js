//import package, controller, middlewares, and creates the router
const express = require('express');
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');
const router = express.Router();

//Routes
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifyOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteOneSauce);
router.post('/:id/like', auth, sauceCtrl.manageLike);

module.exports = router;