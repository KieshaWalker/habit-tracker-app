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



mongoose.connect(process.env.MONGODB_URI);
const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

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
app.get('/', (req, res) => {
  console.log('landing')
  res.render("index.ejs")
});


app.use('/users', userRoutes);
app.use(isSignedIn);
app.use('/habits', habitRoutes);
app.use('/logs', logRoutes);
//app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
