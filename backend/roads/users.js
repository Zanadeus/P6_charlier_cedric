//Constantes de fonctionnement
const express = require('express');
const router = express.Router();

//Chemin vers le contrôlleur utilisateur
const userCtrl = require('../controllers/users');

//Règles de creation et connection d'utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;