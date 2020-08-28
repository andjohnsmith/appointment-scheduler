const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Workout = require('../models/Workout');

/**
 * @route   GET /api/admin/users
 * @desc    Retrieve all users
 * @access  Private
 */
router.get('/users', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');

    if (admin.role !== 'Admin') {
      return res.status(400).json({ msg: 'User is not authorized' });
    }

    let users = await User.find();

    if (req.query.role) {
      users = users.filter((user) => user.role === req.query.role);
    }

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/admin/workouts
 * @desc    Retrieve all workouts
 * @access  Private
 */
router.get('/workouts', auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');

    if (admin.role !== 'Admin') {
      return res.status(400).json({ msg: 'User is not authorized' });
    }

    const workouts = await Workout.find();

    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
