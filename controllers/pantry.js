const express = require('express');
const router = express.Router({ mergeParams: true });
const Food = require('../models/food');
const isSignedIn = require('../middleware/is-signed-in');

// List all foods for a user
router.get('/', isSignedIn, async (req, res) => {
    try {
        const foods = await Food.find({ userId: req.params.userId });
        res.render('foods/index', { foods, userId: req.params.userId });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// Show form to create a new food
router.get('/new', isSignedIn, (req, res) => {
    res.render('foods/new', { userId: req.params.userId });
});

// Add a new food to the database
router.post('/', isSignedIn, async (req, res) => {
    try {
        const newFood = new Food({
            ...req.body,
            userId: req.params.userId
        });
        await newFood.save();
        res.redirect(`/users/${req.params.userId}/foods`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// Show a specific food
router.get('/:itemId', isSignedIn, async (req, res) => {
    try {
        const food = await Food.findById(req.params.itemId);
        res.render('foods/show', { food, userId: req.params.userId });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// Show form to edit a specific food
router.get('/:itemId/edit', isSignedIn, async (req, res) => {
    try {
        const food = await Food.findById(req.params.itemId);
        if (!food) {
            return res.redirect('/'); // Handle case where food is not found
        }
        res.render('foods/edit', { food, userId: req.params.userId });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});
// Update a specific food in the database
router.put('/:itemId', isSignedIn, async (req, res) => {
    try {
        await Food.findByIdAndUpdate(req.params.itemId, req.body);
        res.redirect(`/users/${req.params.userId}/foods/${req.params.itemId}`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// Delete a specific food 
router.delete('/:itemId', isSignedIn, async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.itemId);
        res.redirect(`/users/${req.params.userId}/foods`);
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

module.exports = router;