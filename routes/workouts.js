const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Workout = require('../models/Workout');
const checkObjectId = require('../middleware/checkObjectId');

// @route    GET /api/workouts
// @desc     Retrieve workouts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    let workouts;
    const user = await User.findById(req.user.id); /*.select(-password)*/

    if (req.query.date) {
      // workouts = all workouts with the given date
      workouts = await Workout.find();

      workouts = workouts.filter(
        (workout) => workout.startDate.toDateString() === req.query.date,
      );

      if (workouts.length === 0) {
        console.log('No appointments for ' + req.query.date);
        workouts.push(-1);
      }
    } else if (user.role === 'Admin') {
      workouts = await Workout.find().sort({ startDate: 1 });
    } else if (user.role === 'Trainer') {
      workouts = await Workout.find({ trainer: req.user.id }).sort({
        startDate: 1,
      });
    } else {
      workouts = await Workout.find({ athlete: req.user.id }).sort({
        startDate: 1,
      });
    }

    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET /api/workouts/:id
// @desc     Retrieve a workout by its id
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE /api/workouts/:id
// @desc     Delete a workout
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    await Workout.findOneAndRemove(req.params.id);

    res.json({ msg: 'Workout deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST /api/workouts
// @desc     Create a workout
// @access   Private
router.post('/', auth, async (req, res) => {
  try {
    const newWorkout = new Workout({
      // type: req.body.type,
      startDate: req.body.startDate,
      // endDate: req.body.endDate,
      athlete: req.user.id,
      // trainer: req.body.trainer,
    });

    const workout = await newWorkout.save();

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT /api/workouts/:id
// @desc     Update a workout
// @access   Private
router.put('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ msg: 'Workout not found' });
    }

    workout.isConfirmed = req.body.isConfirmed;

    await workout.save();

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
