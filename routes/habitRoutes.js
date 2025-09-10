const express = require('express');
const router = express.Router();






const userController = require('../controllers/userController');
const habitController = require('../controllers/habitController');
const logController = require('../controllers/logController');

router.get('/', habitController.showAddHabit);


router.post('/', habitController.createHabit);







module.exports = router;