const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// /logs/:habitId - list logs for a habit
router.get('/:habitId', logController.listLogs);
// /logs/:habitId/new - show form to add log
router.get('/:habitId/new', logController.newLogForm);
// Create a log entry
router.post('/:habitId', logController.createLog);
// Delete a log entry
router.delete('/:habitId/:logId', logController.deleteLog);

module.exports = router;