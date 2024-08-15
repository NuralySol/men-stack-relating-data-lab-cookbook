const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

// Route to display the sign-up form
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

// Route to display the sign-in form
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

// Route to handle sign-out
router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Route to handle sign-up logic
router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send('Username already taken.');
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.send('Password and Confirm Password must match');
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;

        const newUser = await User.create(req.body);

        res.redirect('/auth/sign-in');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Route to handle sign-in logic
router.post('/sign-in', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
            return res.send('Login failed. Please try again.');
        }

        const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
        if (!validPassword) {
            return res.send('Login failed. Please try again.');
        }

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        };

        res.redirect(`/users/${userInDatabase._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;