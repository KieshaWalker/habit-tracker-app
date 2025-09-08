const mongoose = require('mongoose');

const habitSchema = require('./Habit').schema;


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    habits: [habitSchema]
})

const User = mongoose.model('User', userSchema);
module.exports = User;