const express = require('express');
const router = express.Router();


const today = new Date();
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);


const User = require('../models/User');
const Habit = require('../models/Habit');

const showAddHabit = async (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).send('User is not logged in');
    const habits = await Habit.find({ user: user._id }).lean();

    res.render('habits/index.ejs', { user, habits });

};


const createHabit = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) return res.status(401).send('User is not logged in');

        const habit = new Habit({
            title: req.body.title,
            description: req.body.description,
            frequency: req.body.frequency,
            targetCount: req.body.targetCount,
            duration: req.body.duration,
            user: user._id,
            createdAt: Date.now(),
        });

        await habit.save();

        console.log('Habit created successfully:', habit);
// Load updated list
        const habits = await Habit.find({ user: user._id }).lean();
        return res.render('users/homepage.ejs', {
            user: req.session.user,
            habits
        });

    } catch (error) {
        console.error('Error creating habit:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Mark a habit as completed for today
const completeHabit = async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, user: req.session.user._id });

        if (!habit) return res.status(404).send('Habit not found');

        habit.habitLog.push({ date: new Date(), status: 'completed' });
        await habit.save();

        const habits = await Habit.find({ user: req.session.user._id }).lean();

        const now = new Date();
        const filteredHabits = habits.filter(habit => {
            const lastComplete = habit.habitLog
                .filter(log => log.status === 'completed')
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            if (!lastComplete) return true;

            switch (habit.frequency) {
                case 'daily':
                    return lastComplete.date.toString() !== now.toDateString();
                case 'weekly':
                    const weekStart = new Date(now);
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    return new Date(lastComplete.date) < weekStart;
                case 'monthly':
                    return new Date(lastComplete.date) < new Date(now.getFullYear(), now.getMonth(), 1);
                default:
                    return true;
            }
        });

        res.render('users/homepage.ejs', { user: req.session.user, habits: filteredHabits });

    } catch (error) {
        console.error('Error completing habit:', error);
        res.status(500).send('Internal Server Error');
    }
};

const showEditHabit =  async (req, res) => {
    console.log('Showing edit form for habit:', req.params.id);
    const user = req.session.user;
  if (!user) return res.status(401).send('User is not logged in');

  const habit = await Habit.findOne({ _id: req.params.id, user: user._id });
  if (!habit) return res.status(404).send('Not found');

  res.render('habits/edit.ejs', { habit });
};

const updateHabit = async (req, res) => {
    console.log('Updating habit:', req.params.id, 'with data:', req.body);
    try {
        const user = req.session.user;
        if (!user) return res.status(401).send('User is not logged in');
        const habit = await Habit.findOne({ _id: req.params.id, user: user._id });
        if (!habit) return res.status(404).send('Not found');

        habit.title = req.body.title;
        habit.description = req.body.description;
        habit.frequency = req.body.frequency;
        habit.targetCount = req.body.targetCount;
        habit.duration = req.body.duration;

        await habit.save();

        console.log('Habit updated successfully:', habit);
        // Load updated list
        const habits = await Habit.find({ user: user._id }).lean();
        return res.render('users/homepage.ejs', {
            user: req.session.user,
            habits,
            updatedHabit: habit
        });

    } catch (error) {
        console.error('Error updating habit:', error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteHabit = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) return res.status(401).send('User is not logged in');
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: user._id });
        if (!habit) return res.status(404).send('Habit not found');

        const habits = await Habit.find({ user: user._id }).lean();
        res.render('users/homepage.ejs', { user, habits });
    } catch (error) {
        console.error('Error deleting habit:', error);
        res.status(500).send('Internal Server Error');
    }
};



module.exports = {
    showAddHabit,
    createHabit,
    completeHabit,
    updateHabit,
    showEditHabit,
    deleteHabit
};