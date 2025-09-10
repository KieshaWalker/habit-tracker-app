const express = require('express');
const router = express.Router();


const today = new Date();
const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);


const User = require('../models/User');
const Habit = require('../models/Habit');

const showAddHabit = (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).send('User is not logged in');
    res.render('habits/index.ejs', { user });
    const { id } = req.params;

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
        return res.render('users/homepage.ejs', {
            user: req.session.user,
            habit
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

        const habits = await Habit.find({ user: req.session.user._id });

        const now = new Date();
        const filteredHabits = habits.filter(habit => {
            const lastComplete = habit.habitLog
            .filter(log => log.status === 'completed')
            .sort((a, b) => b.date - a.date)[0];

             if(!lastComplete) return true;

        switch (habit.frequency) {
            case 'daily':
                return lastComplete.date.toDateString() !== now.toDateString();
            case 'weekly':
                const weekStart = new Date(now);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                return lastComplete.date < weekStart;
            case 'monthly':
                return lastComplete.date < new Date(now.getFullYear(), now.getMonth(), 1);
            default:
                return true;
        }
        }); // Close filter

        res.render('users/homepage.ejs', { user: req.session.user, habits: filteredHabits });

    } catch (error) {
        console.error('Error completing habit:', error);
        res.status(500).send('Internal Server Error');
    }
};
const updateHabit = async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) return res.status(401).send('User is not logged in');

        const { id } = req.params;
        const habit = await Habit.findOne({ _id: id, user: user._id });
        if (!habit) return res.status(404).send('Habit not found');

        const fields = ['title', 'description', 'frequency', 'targetCount', 'duration', 'archived'];
        fields.forEach(f => {
            if (req.body[f] !== undefined && req.body[f] !== '') {
                habit[f] = req.body[f];
            }
        });

        await habit.save();
        return res.redirect('/', {
            user: req.session.user,
            habit
        });
    } catch (error) {
        console.error('Error updating habit:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    showAddHabit,
    createHabit,
    completeHabit,
    updateHabit
};