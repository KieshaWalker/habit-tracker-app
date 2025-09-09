const express = require('express');
const router = express.Router();



const userController = require('../controllers/userController');
const habitController = require('../controllers/habitController');
const logController = require('../controllers/logController');


router.get('/signup', userController.signingup);
router.get('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/login', userController.loggedIn);


module.exports = router;