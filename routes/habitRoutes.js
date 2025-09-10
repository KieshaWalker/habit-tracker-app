const express = require('express');
const router = express.Router();






const userController = require('../controllers/userController');
const habitController = require('../controllers/habitController');
const logController = require('../controllers/logController');

router.get('/', habitController.showAddHabit);


router.post('/', habitController.createHabit);
router.post('/:id/complete', habitController.completeHabit);
router.put('/:id', habitController.updateHabit); // add this line

router.get('/:id/edit', async (req, res) => {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.session.user._id });
  if (!habit) return res.status(404).send('Not found');
  res.render('habits/edit.ejs', { habit });
});




module.exports = router;