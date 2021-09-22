const express = require('express');
const router = express.Router();

const auth = require('../middleware/authToken');
const multer = require('../middleware/multerConfig');

const stuffCtrl = require('../controllers/mainController');

router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;
