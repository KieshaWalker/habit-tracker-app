const express = require('express');
const router = express.Router();






const userController = require('../controllers/userController');
const habitController = require('../controllers/habitController');
const logController = require('../controllers/logController');

router.get('/', habitController.showAddHabit);


router.post('/', habitController.createHabit);
router.post('/:id/complete', habitController.completeHabit);

router.get('/:id/edit', habitController.showEditHabit);
router.put('/:id', habitController.updateHabit);

router.delete('/:id', habitController.deleteHabit);

module.exports = router;