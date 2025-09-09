const express = require('express');
const router = express.Router();


const User = require('../models/User');
const Habit = require('../models/Habit');

const showAddHabit = (req, res) => {
    const user = req.session.user;
    if (!user) return res.status(401).send('User is not logged in');
    res.render('habits/index.ejs', { user });
};

const createHabit = async (req, res) => {
 res.render('hi')
};

module.exports = {
    showAddHabit,
    createHabit,
};