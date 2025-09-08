const mongoose = require('mongoose');


const habitLogSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['completed', 'missed'],
        required: [true, 'Please add a status']
    }
});

const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    frequency: {
        type: String,
            enum: ['daily', 'weekly', 'monthly', 'custom'],
    default: 'daily',  
        required: [true, 'Please add a frequency'],
    },
  targetCount: {
    type: Number,
    default: 1 
  },
    duration: {
        type: Number,
        required: [true, 'Please add a duration'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
      archived: {
    type: Boolean,
    default: false
  },
  habitLog: [habitLogSchema]
});



const Habit = mongoose.model('Habits', habitSchema);
module.exports = Habit;
