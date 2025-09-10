// Log controller: exports plain handler functions (no Express router here)
const User = require('../models/User');
const Habit = require('../models/Habit');

// List all log entries for a habit
const listLogs = async (req, res) => {
	try {
		const user = req.session.user;
		if (!user) return res.status(401).send('Not authorized');
		const habit = await Habit.findOne({ _id: req.params.habitId, user: user._id }).lean();
		if (!habit) return res.status(404).send('Habit not found');
		const logs = (habit.habitLog || []).sort((a, b) => new Date(b.date) - new Date(a.date));
		res.render('habitLogs/index.ejs', { user, habit, logs });
	} catch (err) {
		console.error('Error listing logs:', err);
		res.status(500).send('Internal Server Error');
	}
};

// Show form to create a manual log (completed or missed)
const newLogForm = async (req, res) => {
	try {
		const user = req.session.user;
		if (!user) return res.status(401).send('Not authorized');
		const habit = await Habit.findOne({ _id: req.params.habitId, user: user._id }).lean();
		if (!habit) return res.status(404).send('Habit not found');
		res.render('habitLogs/new.ejs', { user, habit });
	} catch (err) {
		console.error('Error rendering new log form:', err);
		res.status(500).send('Internal Server Error');
	}
};

// Create a log entry
const createLog = async (req, res) => {
	try {
		const user = req.session.user;
		if (!user) return res.status(401).send('Not authorized');
		const habit = await Habit.findOne({ _id: req.params.habitId, user: user._id });
		if (!habit) return res.status(404).send('Habit not found');

		const status = req.body.status === 'missed' ? 'missed' : 'completed';
		habit.habitLog.push({ status, date: new Date() });
		await habit.save();
		res.redirect(`/logs/${habit._id}`);
	} catch (err) {
		console.error('Error creating log entry:', err);
		res.status(500).send('Internal Server Error');
	}
};

// Delete a specific log entry
const deleteLog = async (req, res) => {
	try {
		const user = req.session.user;
		if (!user) return res.status(401).send('Not authorized');
		const habit = await Habit.findOne({ _id: req.params.habitId, user: user._id });
		if (!habit) return res.status(404).send('Habit not found');

		const before = habit.habitLog.length;
		habit.habitLog = habit.habitLog.filter(l => l._id.toString() !== req.params.logId);
		if (habit.habitLog.length === before) {
			return res.status(404).send('Log entry not found');
		}
		await habit.save();
		res.redirect(`/logs/${habit._id}`);
	} catch (err) {
		console.error('Error deleting log entry:', err);
		res.status(500).send('Internal Server Error');
	}
};


const showAllCurrentHabitsInProgress = async (req, res) => {
	try {
		const user = req.session.user;
		if (!user) return res.status(401).send('Not authorized');
		const habits = await Habit.find({ user: user._id }).lean();
		res.render('habits/index.ejs', { user, habits });
	} catch (err) {
		console.error('Error showing current habits:', err);
		res.status(500).send('Internal Server Error');
	}
};





module.exports = {
	listLogs,
	newLogForm,
	createLog,
	deleteLog,
};
