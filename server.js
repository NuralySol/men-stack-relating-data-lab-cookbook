const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');

const authController = require('./controllers/auth');
const foodController = require('./controllers/food');
const passUserToView = require('./middleware/pass-user-to-view');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passUserToView);

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.redirect('/auth/sign-in');
});

app.use('/auth', authController);
app.use('/users/:userId/foods', foodController);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});