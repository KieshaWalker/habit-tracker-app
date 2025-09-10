const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Removed static day bounds; will fetch all habits instead of only those created today.


const User = require('../models/User');
const Habit = require('../models/Habit');
 const { isHabitDue } = require('../utils/dateHelpers');
const login = (req, res) => {
    console.log('Rendering login page');
    res.render('users/signin.ejs');
};

const signingup = (req, res) => {
    console.log('Sign-up request received:');
    res.render('users/signup.ejs');
};

const signup = async (req, res) => {
    try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }
  
    // Username is not taken already!
    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }
  
    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
  
    // All ready to create the new user!
    await User.create(req.body);
  
    res.redirect('/users');
  } catch (error) {
    console.log(error);
    res.render('users/homepage.ejs');
  }
  }


const loggedIn = async (req, res) => {
    console.log('Login request received:', req.body);
 try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }
  
    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );

    if (!validPassword) {
      return res.send('Invalid password. please try again.');
    }
  
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = { username: userInDatabase.username, _id: userInDatabase._id };
  const habits = await Habit.find({ user: userInDatabase._id, archived: false }).lean();
  return res.render('users/homepage.ejs', { user: req.session.user, habits });

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
};


const signOut = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Error signing out:', err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
};

module.exports = {
    signingup,
    login,
    signup,
    loggedIn,
    signOut

};

