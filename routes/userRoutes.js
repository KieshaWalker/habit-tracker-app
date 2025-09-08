const express = require('express');
const router = express.Router();






const userController = require('../controllers/userController');
const habitController = require('../controllers/habitController');
const logController = require('../controllers/logController');

router.get('/signup', (req, res) => {
    console.log('Rendering sign-up page');
    res.render('./users/signup.ejs');
});

router.get('/login', (req, res) => {
    console.log('Rendering login page');
    res.render('./users/signin.ejs');
});

router.post('/signup', async (req, res) => {
  try {
    // Check if user already exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user and save to database
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    await newUser.save();

    res.redirect('/users/login');
  }

    catch (error) {
      console.error('Error occurred during sign-up:', error);
      res.status(500).send('Internal Server Error');
    }
    console.log('Sign-up request received:', req.body);
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }

    req.session.userId = user._id;
    res.redirect('/homepage.ejs');
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).send('Internal Server Error');
  }
});







module.exports = router;