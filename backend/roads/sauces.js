//Constantes de fonctionnement
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authToken');
const multer = require('../middleware/multerConfig');

//Chemin vers le contrôlleur utilisateur
const saucesCtrl = require('../controllers/sauces');
//Règles de gestion des sauces
router.get('/', auth, saucesCtrl.getAllSauces);//ok
router.get('/:id', auth, saucesCtrl.getOneSauce);//ok
router.post('/', auth, multer, saucesCtrl.createSauce);//
router.put('/:id', auth, multer, saucesCtrl.modifySauce);//?
router.delete('/:id', auth, multer, saucesCtrl.deleteSauce);//ok
router.post('/:id/like', auth, multer, saucesCtrl.setLike);

module.exports = router;