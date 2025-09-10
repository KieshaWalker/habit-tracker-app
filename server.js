const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path= require('path')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const isSignedIn = require('./middleware/isSignedIn.js');
const passUserToView = require('./middleware/passUserToView.js');


const userRoutes = require('./routes/userRoutes.js');
const habitRoutes = require('./routes/habitRoutes.js');
const logRoutes = require('./routes/logRoutes.js');
 const { isHabitDue } = require('./utils/dateHelpers');
const Habit = require('./models/Habit');

mongoose.connect(process.env.MONGODB_URI);
const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(passUserToView);

app.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.render('index.ejs'); // landing page for non-logged-in users
    }

  const habits = await Habit.find({ user: req.session.user._id }).lean();
  res.render('users/homepage.ejs', { user: req.session.user, habits });
  } catch (error) {
    console.error(error);
  res.redirect('/users/login');
  }
});


app.use('/users', userRoutes);
app.use(isSignedIn);

app.use('/habits', habitRoutes);

app.use('/logs', logRoutes);
// Removed duplicate /users mount (already mounted above)

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
